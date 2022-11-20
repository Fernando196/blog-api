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
router.get("/buscar", (req, res) => {
    BlogService
        .searchBlog(req)
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
router.put("/:id",memoryUpload.single('file'), (req, res) => {
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


// Comentario

router.get('/comentario/:id', (req, res)=>{
    BlogService
        .getComentario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

router.post('/:id/comentario', (req, res)=>{
    BlogService
        .createComentario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

router.put('/:id/comentario/:idComentario', (req, res)=>{
    BlogService
        .putComentario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

router.delete('/:id/comentario/:idComentario', (req, res)=>{
    BlogService
        .deleteComentario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

module.exports = router;
