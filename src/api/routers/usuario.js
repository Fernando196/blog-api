const express = require("express");
const router = express.Router();
const UsuarioService = require("../../services/usuario.service");

router.get("/:id", (req, res) => {
    UsuarioService
        .getUsuario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.post("/registro", (req, res) => {
    UsuarioService
        .createUsuario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.put("/:id", (req, res) => {
    UsuarioService
        .putUsuario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});
router.delete("/:id", (req, res) => {
    UsuarioService
        .deleteUsuario(req)
        .then(response => {
            res.status(response.code).send(response.data);
        })
        .catch(err => {
            res.status(500).send();
        });
});

module.exports = router;
