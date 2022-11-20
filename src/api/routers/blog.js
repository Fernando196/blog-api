const express = require("express");
const router = express.Router();
const BlogService = require("../../services/blog.service");

const { memoryUpload } = require('../../middleware/multer');

router.get("/", (req, res) => {
    BlogService
        .getBlog(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.get("/:id", (req, res) => {
    BlogService
        .getBlog(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.post("/",memoryUpload.single('file'), (req, res) => {
    BlogService
        .createBlog(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.put("/:id", (req, res) => {
    BlogService
        .putBlog(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.delete("/:id", (req, res) => {
    BlogService
        .deleteBlog(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

module.exports = router;
