const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const Redirect = require('../models/Redirect');
const xml2js = require('xml2js');


const getBlogs = async (req, res) => {
  try {
    const { category, search, tag } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(filter)
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 });
      
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email profilePicture bio');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, category, coverImage, tags } = req.body;
    
    const newBlog = await Blog.create({
      title,
      content,
      category,
      coverImage,
      tags: tags || [],
      author: req.user._id
    });
    
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(401).json({ message: 'User not authorized to update this blog' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(401).json({ message: 'User not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user.id;
    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
      
      if (blog.author.toString() !== userId) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          blogId: blog._id,
          type: 'like',
          message: 'liked your post'
        });
      }
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const importXmlBlogs = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }

    const { xmlData } = req.body;
    if (!xmlData) {
      return res.status(400).json({ message: 'No XML data provided.' });
    }

    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    const result = await parser.parseStringPromise(xmlData);

    let items = [];
    if (result.rss && result.rss.channel && result.rss.channel.item) {
      items = result.rss.channel.item;
    } else if (result.feed && result.feed.entry) {
      items = result.feed.entry;
    } else {
      return res.status(400).json({ message: 'Unsupported XML structure. Must be RSS or Atom Feed.' });
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    const importedBlogs = [];
    for (const item of items) {
      const title = item.title || 'Untitled Legacy Post';
      let content = item['content:encoded'] || item.description || item.summary || item.content || '';
      if (typeof content === 'object') {
        content = content._ || '';
      }

      let category = 'Coding';
      let tags = [];
      if (item.category) {
        if (Array.isArray(item.category)) {
          category = item.category[0] || 'Coding';
          tags = item.category.map(c => typeof c === 'string' ? c : c._ || '');
        } else {
          category = typeof item.category === 'string' ? item.category : item.category._ || 'Coding';
          tags = [category];
        }
      }

      let coverImage = '';
      if (item['media:content'] && item['media:content'].url) {
        coverImage = item['media:content'].url;
      } else {
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
        const match = imgRegex.exec(content);
        if (match) {
          coverImage = match[1];
        }
      }

      const newBlog = await Blog.create({
        title,
        content: content || 'No content.',
        category: category || 'Coding',
        coverImage: coverImage || '',
        tags: tags.filter(t => !!t),
        author: req.user._id
      });

      const originalLink = item.link || '';
      let oldPath = '';
      if (originalLink) {
        try {
          if (originalLink.startsWith('http')) {
            const urlObj = new URL(originalLink);
            oldPath = urlObj.pathname;
          } else {
            oldPath = originalLink;
          }
        } catch (e) {
          oldPath = originalLink;
        }
      }

      if (oldPath && oldPath !== '/' && oldPath !== '/index.html') {
        const existingRedirect = await Redirect.findOne({ oldPath });
        if (!existingRedirect) {
          await Redirect.create({
            oldPath,
            newPath: `/blog/${newBlog._id}`,
            blogId: newBlog._id
          });
        }
      }

      importedBlogs.push(newBlog);
    }

    res.status(201).json({
      message: `Successfully synchronized ${importedBlogs.length} legacy entries.`,
      count: importedBlogs.length,
      blogs: importedBlogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Import operation failed.', error: error.message });
  }
};

const importJsonBlogs = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }

    const { jsonData } = req.body;
    if (!jsonData) {
      return res.status(400).json({ message: 'No JSON data provided.' });
    }

    let rawData;
    if (typeof jsonData === 'string') {
      rawData = JSON.parse(jsonData);
    } else {
      rawData = jsonData;
    }

    let annotations = [];
    if (Array.isArray(rawData)) {
      annotations = rawData;
    } else if (rawData.rows && Array.isArray(rawData.rows)) {
      annotations = rawData.rows;
    } else {
      annotations = [rawData];
    }

    const importedBlogs = [];
    for (const annotation of annotations) {
      const isHypothesis = annotation.uri && annotation.target;
      
      let title = '';
      let content = '';
      let tags = [];
      let category = 'AI';

      if (isHypothesis) {
        let quotedText = '';
        if (annotation.target && annotation.target[0] && annotation.target[0].selector) {
          const selectors = Array.isArray(annotation.target[0].selector) ? annotation.target[0].selector : [annotation.target[0].selector];
          const quoteSelector = selectors.find(s => s.type === 'TextQuoteSelector');
          if (quoteSelector) {
            quotedText = quoteSelector.exact || '';
          }
        }

        const note = annotation.text || '';
        tags = annotation.tags || ['Annotation'];
        title = `Annotation of: ${annotation.uri.replace(/https?:\/\/(www\.)?/, '').substring(0, 40)}...`;
        
        content = `
          <h3>Annotated Excerpt</h3>
          <blockquote>"${quotedText}"</blockquote>
          <hr />
          <h3>Narrative Commentary</h3>
          <p>${note}</p>
          <hr />
          <p><em>Source: <a href="${annotation.uri}" target="_blank">${annotation.uri}</a></em></p>
        `.trim();
      } else {
        title = annotation.title || annotation.name || 'Imported Document';
        content = annotation.content || annotation.body || annotation.text || 'Empty manuscript content.';
        tags = annotation.tags || ['Imported'];
        category = annotation.category || 'Coding';
      }

      const newBlog = await Blog.create({
        title,
        content,
        category,
        coverImage: annotation.coverImage || '',
        tags,
        author: req.user._id
      });

      importedBlogs.push(newBlog);
    }

    res.status(201).json({
      message: `Successfully synthesized ${importedBlogs.length} documents.`,
      count: importedBlogs.length,
      blogs: importedBlogs
    });
  } catch (error) {
    res.status(500).json({ message: 'JSON import operation failed.', error: error.message });
  }
};

const resolveRedirect = async (req, res) => {
  try {
    const { path: searchPath } = req.query;
    if (!searchPath) {
      return res.status(400).json({ message: 'Path parameter is required.' });
    }

    let cleanPath = searchPath.trim();
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    const redirect = await Redirect.findOne({ 
      $or: [
        { oldPath: cleanPath },
        { oldPath: cleanPath + '/' }
      ]
    });

    if (!redirect) {
      return res.status(404).json({ message: 'No redirect mapping found.' });
    }

    res.status(200).json(redirect);
  } catch (error) {
    res.status(500).json({ message: 'Redirect lookup failed.', error: error.message });
  }
};

const getRedirects = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }

    const redirects = await Redirect.find({}).sort({ createdAt: -1 });
    res.status(200).json(redirects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch redirect database.', error: error.message });
  }
};

const deleteRedirect = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }

    const redirect = await Redirect.findById(req.params.id);
    if (!redirect) {
      return res.status(404).json({ message: 'Redirect mapping not found.' });
    }

    await redirect.deleteOne();
    res.status(200).json({ message: 'Redirect mapping permanently purged.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete redirect mapping.', error: error.message });
  }
};

module.exports = { 
  getBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  toggleLike,
  importXmlBlogs,
  importJsonBlogs,
  resolveRedirect,
  getRedirects,
  deleteRedirect
};