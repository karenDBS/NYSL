
var app = new Vue({
    el: '#app',
    data: {
        mail: '',
        password: '',
        user: null,
        message: null,
        messages: [],
        game: '',
    },
    methods: {

        cambioDePantallas: function (page, namePage) {
            document.getElementById("cuarta-pantalla").classList.add("d-none");
            document.getElementById("tercera-pantalla").classList.add("d-none");
            document.getElementById("segunda-pantalla").classList.add("d-none");
            document.getElementById("primera-pantalla").classList.add("d-none");
            document.getElementById("pantalla-chat").classList.add("d-none");
            document.querySelector(".pagina").textContent = namePage;
            document.getElementById(page).classList.remove("d-none");
        },
        registrar: function () {
            firebase.auth().createUserWithEmailAndPassword(app.mail, app.password)
                .then(function () {
                    app.mail = '';
                    app.password = '';
                })
                .catch(function (error) {
                    var errorMessage = error.message;
                    document.getElementById('errorMail').textContent = errorMessage;
                })
        },
        yaRegistrado: function () {
            firebase.auth().signInWithEmailAndPassword(app.mail, app.password)
                .then(function () {
                    app.mail = '';
                    app.password = '';
                })
                .catch(function (error) {
                    var errorMessage = error.message;
                    alert("error: " + errorMessage);
                });
        },
        registrarGmail: function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function () {
            })
        },
        publicar: function () {
            if (app.message != null) {
                firebase.database().ref('mensajes/' + app.game).push({
                    mensaje: app.message,
                    email: app.user,
                })
                    .then(function () {
                        app.message = null;
                    })
            }
        },
        logout: function () {
            firebase.auth().signOut().then(function () {
                app.cambioDePantallas("primera-pantalla", "Home");
                document.querySelector('#botonRegistro').textContent = "Login";
            });
        },
        chatDePartidos: function (game) {
            if (app.user != null) {
                app.game = game;
                app.messages = [];
                app.cambioDePantallas("pantalla-chat", "Foro");
                firebase.database().ref('mensajes/' + app.game).off();
                firebase.database().ref('mensajes/' + app.game).on('child_added', (snapshot) => {
                    app.messages.push(snapshot.val());
                })
            } else {
                alert("Para ingresar al foro debes estar logueado");
            }
        },
        estado: function () {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    app.user = firebase.auth().currentUser.email;
                    document.querySelector('#botonRegistro').textContent = "Hola! " + app.user;
                } else {
                    app.user = null;
                }
            })
        }
    }
});

app.estado();