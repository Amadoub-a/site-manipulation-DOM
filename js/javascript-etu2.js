/**
 *  Fichier principal javascript
 */
"use strict";

/*global DATA_QUIZ, bootstrap, tableQuestions*/

/**
 * Permet de créer un popover 
 * @author Marie Wideline Pierre
 */
function creerPoppover(pIdContenuPopover, pIdBoutonAssocie, pEntete) {

    // Récupération du bouton pour afficher le Popover.
    let button = document.getElementById(pIdBoutonAssocie);

    let contenuPopover = document.getElementById(pIdContenuPopover).innerHTML;

    // Définir les options du popover
    let optionsPopover = {
        container: "body",
        title: pEntete,
        html: true,
        content: contenuPopover,
    };
    // Créer et afficher le popover sur le bouton associé
    new bootstrap.Popover(button, optionsPopover);
}

/**
 * Permet de calculer le score total de l’utilisateur, l’arrondi et le retourne 
 * @author Marie Wideline Pierre
 * @param {Int} pNbPoint | Le nombre de points
 * @param {Int} pTotalPoints | le nombre total de points a obtenir
 */

function calculerScore(pNbPoint, pTotalPoints) {
    // Calculer le score en pourcentage
    let score = (parseInt(pNbPoint) / parseInt(pTotalPoints)) * 100;

    // Arrondir à l'unité la plus proche en utilisant toFixed()
    score = parseFloat(score.toFixed(0));

    // Retourner le score arrondi
    return score;
}

/**
 * Permet d’afficher toutes les questions en allant chercher le numéro de la question, 
 * le numéro du module, le titre du module, la question, la réponse de l’utilisateur, 
 * le nombre de points, la rétroaction (même design de contenu que le toast), les points, le score final en % 
 * @author Marie Wideline Pierre
 */
function creerHTMLMesReponses() {
    // Appel de la div qui contient le OffCanvas par sa classe
    let divOffCanvas = document.getElementsByClassName("offcanvas-body")[0];
    let bonnesReponses = document.getElementById("scoreBonneReponse");
    let score = document.getElementById("score");

    let nbBonnesReponses = 0;
    let index = 1;
    let scoreTotal = 0;
    for (let question of tableQuestions) {

        //Déclaration des variables 
        let titreModule = document.createElement("h4");
        let pQuestion = document.createElement("p");
        let pReponse = document.createElement("p");
        pReponse.classList.add("fw-bold");
        // Score par question
        let pointage = document.createElement("p");
        pointage.classList.add("fw-bold");

        //Relie le div avec son titre et ses paragraphes
        divOffCanvas.appendChild(titreModule);
        divOffCanvas.appendChild(pQuestion);
        divOffCanvas.appendChild(pReponse);
        divOffCanvas.appendChild(pointage);

        //Création du div qui interagit avec l'utilisateur
        let divFlex = document.createElement("div");
        divFlex.classList.add("d-flex");

        // Variable qui indique la réponse à l'utilisateur
        let pCorrection = document.createElement("p");

        //Div qui contient la bonne réponse
        let divReponse = document.createElement("div");
        divReponse.classList.add("alert");
        divReponse.role = "alert";

        //L'icône qui indique si la réponse est correcte ou pas
        let i = document.createElement("i");
        i.classList.add("bi");
        i.classList.add("fs-1");

        //
        divFlex.appendChild(i);
        divFlex.appendChild(divReponse);
        divReponse.appendChild(pCorrection);

        if (question.pointageQuestion == 0) {
            //Si l'utilisateur n'a pas eu la bonne réponse
            divReponse.classList.add("alert-danger");
            i.classList.add("bi-x");
            i.classList.add("text-danger");
            pointage.classList.add("text-danger");
            pCorrection.textContent = question.retroactionNegative;
        } else {
            // Si l'utilisateur a répondu correctement
            divReponse.classList.add("alert-success");
            i.classList.add("bi-check2");
            i.classList.add("text-success");
            pointage.classList.add("text-success");
            nbBonnesReponses += question.pointageQuestion;
            pCorrection.textContent = question.retroactionPositive;
        }
        let titreModuleConcerne = DATA_QUIZ.modules[question.modulesId].titre;

        titreModule.textContent = "Question " + index + "-" + " Module 0" + question.modulesId + "(" + titreModuleConcerne + ")";
        pQuestion.textContent = question.titre;
        pReponse.textContent = "Votre réponse : " + question.reponsesUtilisateur;
        pointage.textContent = question.pointageQuestion + "/1";
        divOffCanvas.appendChild(divFlex);

        // Incrémenter l'index pour la prochaine question
        index++;
    }

    scoreTotal = calculerScore(nbBonnesReponses, tableQuestions.length);
    bonnesReponses.textContent = "Bonne(s) réponses(s) : " + nbBonnesReponses + "/" + tableQuestions.length;
    score.textContent = "Score : " + scoreTotal + "%";
    let progress = document.getElementsByClassName("progress")[0];
    progress.style.height = "70px";

    let progression = document.getElementById("progressionScore");
    progression.textContent = scoreTotal + "%";
    progression.style.width = `${scoreTotal}%`;
    if (scoreTotal == 0) {
        progression.style.width = "100%";
    }
    if (scoreTotal < 50) {
        progression.classList.add("bg-danger");
    }
    else {
        progression.classList.add("bg-success");
    }
}

/**
 * Permet d’afficher toutes les questions en allant chercher le numéro de la question, 
 * le numéro du module, le titre du module, la question, la réponse de l’utilisateur, 
 * le nombre de points, la rétroaction (même design de contenu que le toast), les points, le score final en % 
 * @author Marie Wideline Pierre
 */
function remplirOffCanvas() {
    //Appel de la fonction
    creerHTMLMesReponses();

    //Appel de la fonction
    let btnTelecharger = document.getElementById("btnTelecharger");
    btnTelecharger.addEventListener("click", telechargerReponses);
    
    //Appel de la fonction
    creerFormulaireEnvoiReponses("formulaireOffCanvas");

    //Appel de la fonction
    let formReponse = document.getElementById("formReponse");
    formReponse.addEventListener("submit", validerFormulaireEnvoiReponses);
}

/**Prépare le HTML à monter pour le formulaire qui enverra les résultats par courriel 
 * @author Marie Wideline Pierre
 * @param {string} pElementBodyOffCanva | id de l'element qui contien le offcanvas
 */
function creerFormulaireEnvoiReponses(pElementBodyOffCanva) {

    let elementBodyOffCanva = document.getElementById(pElementBodyOffCanva);
   
    // Création du formulaire
    let form = document.createElement("form");
        form.id = "formReponse";
        form.method = "post";
        form.classList.add("m-2");

    //Titre Formulaire
    let titreForm = document.createElement("h4");
    titreForm.textContent = "Envoyer mes résultats";

    //DivNom
    let divNom = document.createElement("div");
    divNom.classList.add("d-flex");
    divNom.classList.add("flex-column");
    divNom.classList.add("mb-3");
    divNom.id = "divNom";

    //label nom
    let labelNom = document.createElement("label");
    labelNom.for = "txtNom";
    labelNom.classList.add("form-label");
    labelNom.textContent = "Nom";

    let span = document.createElement("span");
    span.classList.add("text-danger");
    span.textContent = "*";

    //input nom
    let inputNom = document.createElement("input");
    inputNom.type = "text";
    inputNom.classList.add("form-control");
    inputNom.classList.add("border-dark");
    inputNom.setAttribute("aria-label", "nom");
    inputNom.name = "txtNom";
    inputNom.id = "txtNom";
    inputNom.placeholder = "Votre nom";

    //DivCourriel
    let divCourriel = document.createElement("div");
    divCourriel.classList.add("d-flex");
    divCourriel.classList.add("flex-column");
    divCourriel.classList.add("mb-3");
    divCourriel.id = "divCourriel";

    //label Courriel
    let labelCourriel = document.createElement("label");
    labelCourriel.for = "email";
    labelCourriel.classList.add("form-label");
    labelCourriel.textContent = "Courriel";

    let spanCourriel = document.createElement("span");
    spanCourriel.classList.add("text-danger");
    spanCourriel.textContent = "*";

    //input Courriel
    let inputCourriel = document.createElement("input");
    inputCourriel.type = "email";
    inputCourriel.id = "email"; 
    inputCourriel.name = "txtCourriel";
    inputCourriel.autocomplete = "email";
    inputCourriel.classList.add("form-control");
    inputCourriel.classList.add("border-dark");
    inputCourriel.placeholder = "xyz@gmail.com";
    inputCourriel.setAttribute("aria-label", "email");
   
    //DivBouton
    let divButton = document.createElement("div");
    divButton.classList.add("d-flex");
    divButton.classList.add("justify-content-center");
    divButton.classList.add("m-2");

    //Bouton
    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-dark");
    button.classList.add("w-75");
    button.type = "submit";
    button.textContent = "Envoyer";
    button.id = "btnEnvoyer";

    //Appel
    form.appendChild(titreForm);
    form.appendChild(divNom);
    divNom.appendChild(labelNom);
    labelNom.appendChild(span);
    divNom.appendChild(inputNom);
    form.appendChild(divCourriel);
    divCourriel.appendChild(labelCourriel);
    labelCourriel.appendChild(spanCourriel);
    divCourriel.appendChild(inputCourriel);
    form.appendChild(divButton);
    divButton.appendChild(button);
    elementBodyOffCanva.appendChild(form);

    document.getElementById("txtNom").addEventListener("blur", function(){
        validerChampNom(this);
    });
}

/**Permet de créer et télécharger un fichier texte
 * @author Marie Wideline Pierre
 * @param {string} content | le contenu a mettre dans le fichier
 * @param {string} fileName | le nom du fichier
 */
function createFile(content, fileName) {
    // Créer un fichier avec le contenu, le nom et le type
    let file = new File(["\ufeff" + content], fileName, { type: "text/plain;charset=UTF-8" });

    // Générer une URL temporaire pour le fichier
    let url = window.URL.createObjectURL(file);

    // Créer un élément <a> caché pour déclencher le téléchargement
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = file.name;

    // Ajouter l'élément à la page
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Révoquer l'URL pour libérer les ressources
    window.URL.revokeObjectURL(url);
}

/**
 * @author Marie Wideline Pierre
 * Permet de generer les reponses a partir d'un tableau
 * @returns 
 */
function genererReponses(){

    // Initialisation du contenu
    let contenu = "Résultats du Quiz :\n\n";
    let index = 1;
    let nbBonnesReponses = 0;

    // Boucle pour ajouter les informations
    for (let question of tableQuestions) {
        contenu += "Question " + index + " - Module 0" + question.modulesId + ":\n";
        contenu += "- Titre : " + question.titre + "\n";
        contenu += "- Votre réponse : " + question.reponsesUtilisateur + "\n";
        contenu += "- Pointage : " + question.pointageQuestion + "/1\n";

        // Ajout de la rétroaction positive ou négative
        if (question.pointageQuestion > 0) {
            contenu += question.retroactionPositive + "\n\n";
        } else {
            contenu += question.retroactionNegative + "\n\n";
        }
        //Récupère la bonne réponse
        nbBonnesReponses += question.pointageQuestion;
        // Incrémenter l'index pour la prochaine question
        index++;
    }    
    // Ajout du score total
    contenu += "Total de bonne(s) réponse(s) : " + nbBonnesReponses + "/" + tableQuestions.length + "\n";
    return contenu;
}

/**Permet de télécharger les réponses de l'utilisateur dans un fichier
 * @author Marie Wideline Pierre
 */
function telechargerReponses() {
    let contenu = genererReponses();  
    // Appel de la fonction pour télécharger le fichier
    createFile(contenu, "ResultatsQuiz.txt");
}

/**
 * @author Marie Wideline Pierre
 * Validation du champs nom
 * @param {string} pElementNom | input qui recoit le nom
 * @returns 
 */
function validerChampNom(pElementNom){

    if (pElementNom.value.length < 3 || pElementNom.value[0] !== pElementNom.value[0].toUpperCase()) 
    {
            pElementNom.classList.add("is-invalid");
            pElementNom.classList.remove("is-valid");

            let divNom= document.getElementById("divNom");
     
        //Vérifie pour empecher de générer plusieurs fois la div feedback à chaque clique
        if(divNom.lastElementChild.tagName === "INPUT"){
            let selectInputInvalid = document.createElement("div");
            selectInputInvalid.classList.add("invalid-feedback");
            selectInputInvalid.textContent = "Le nom doit avoir au moins 3 caractères et doit commencer par une lettre majuscule";
            divNom.appendChild(selectInputInvalid);
            
        }

        return false;
    } 
    else{
        pElementNom.classList.add("is-valid");
        pElementNom.classList.remove("is-invalid");
        return true;
    }
}

/**
 * @author Marie Wideline Pierre
 * Fonction qui valide l'adresse mail en utilisant le regex
 * @param {string} pElementCourriel | input qui recoit l'adresse mail
 * @returns 
 */
function validerChampCourriel(pElementCourriel){

    /* eslint-disable no-useless-escape */
    const regexCourriel = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    pElementCourriel.value = pElementCourriel.value.trim();

    if (!regexCourriel.test(pElementCourriel.value)) 
    {
        pElementCourriel.classList.add("is-invalid");
        pElementCourriel.classList.remove("is-valid");

            let divCourriel= document.getElementById("divCourriel");
     
        //Vérifie pour empecher de générer plusieurs fois la div feedback à chaque clique
        if(divCourriel.lastElementChild.tagName === "INPUT"){
            let selectInputInvalid = document.createElement("div");
            selectInputInvalid.classList.add("invalid-feedback");
            selectInputInvalid.textContent = "Le corriel doit être valide";
            divCourriel.appendChild(selectInputInvalid);
        }
        return false;
    }
    else{
        pElementCourriel.classList.add("is-valid");
        pElementCourriel.classList.remove("is-invalid");
        return true;
    }
}

/**Fonction pour valider le formulaire pour envoyer les reponses de l'utilisateur par mail
 * @author Marie Wideline Pierre
 */
function validerFormulaireEnvoiReponses(e) {
    e.preventDefault();
    let estNomValide = validerChampNom(e.target.txtNom);
    let estCourrielValide = validerChampCourriel(e.target.txtCourriel);

    if (!estNomValide || !estCourrielValide) {
        e.preventDefault();
        return false;
    }
    else{
        let contenu = genererReponses();
        let mail = e.target.txtCourriel.value;
        e.target.action = `mailto:${mail}?subject=Quiz%20web2&body=${contenu}`;
        e.target.submit();
    }
}


