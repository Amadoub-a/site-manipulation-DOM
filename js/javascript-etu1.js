/**
 *  Fichier principal javascript
 */
"use strict";
/*global DATA_QUIZ, bootstrap, creerPoppover, remplirOffCanvas*/ 

/**
 * Tableau global pour les questions generées
 */
let tableQuestions = [];

/**
 * Permet de valider si un élément de la liste a été sélectionné lors du filtre
 * @author Amadou KOUYATE
 * @param {string} pListe la valeur qui doit venir de liste
 * @returns 
 */
function validerSlecteFiltres(pListe){

    if (pListe.value === "Choisir un module") {
        pListe.classList.add("is-invalid");
        pListe.classList.remove("is-valid");
        
        let divModules = document.getElementById("divModules");
     
        //Vérifie pour empecher de générer plusieurs fois la div feedback à chaque clique
        if(divModules.lastElementChild.tagName === "SELECT"){
            let selectInputInvalid = document.createElement("div");
            selectInputInvalid.classList.add("invalid-feedback");
            selectInputInvalid.textContent = "Vous devez faire un choix dans la liste";
            divModules.appendChild(selectInputInvalid);
        }
        return false;

    }else {
        pListe.classList.add("is-valid");
        pListe.classList.remove("is-invalid");

        return true;
    }
}

/**
 * @author Amadou KOUYATE
 * Permet de valider l'envoie du formulaire pour les filtres de module
 */
function validerFormulaireFiltre(e) {
    let estListeValide = validerSlecteFiltres(e.target.lstModule);

    if (!estListeValide)
        return false;

    return true;
}

/**
 * Fonction qui permet de valider si l'input nombre de question est correctement rempli
 * @author Amadou KOUYATE
 * @param {string} pElementNbQuestion la valeur qui doit venir de l'input
 * @returns 
 */
function validerChampNbQuestion(pElementNbQuestion){

    if (pElementNbQuestion.value < 0 || pElementNbQuestion.value > 5 || pElementNbQuestion.value === "") {
        pElementNbQuestion.classList.add("is-invalid");
        pElementNbQuestion.classList.remove("is-valid");

        let divCreationQuestion = document.getElementById("divCreationQuestion");
     
        //Vérifie pour empecher de générer plusieurs fois la div feedback à chaque clique
        if(divCreationQuestion.lastElementChild.tagName === "INPUT"){
            let selectInputInvalid = document.createElement("div");
            selectInputInvalid.classList.add("invalid-feedback");
            selectInputInvalid.textContent = "Vous devez choisir un nombre de 1 à 5";
            divCreationQuestion.appendChild(selectInputInvalid);
        }

        return false;
    }
    else{
        pElementNbQuestion.classList.add("is-valid");
        pElementNbQuestion.classList.remove("is-invalid");
        return true;
    }
}

/**
 * @author Amadou KOUYATE
 * Permet de valider l'envoie du formulaire pour le nombre de question à générer
 */
function validerFormulaireNbQuestion(e) {
    let estNbQuestion = validerChampNbQuestion(e.target.nbQuestion);

    if (!estNbQuestion)
        return false;

    return true;
}


/**
 * Permet de générer un card.
 * @author Amadou KOUYATE
 */
function genererUnCard() {
    //div col
    let divCol = document.createElement("div");
    divCol.classList.add("col-md-4");
    divCol.classList.add("mb-4");
                    
    //div card
    let divCard = document.createElement("div");
    divCard.classList.add("card");
   
    //image du card
    let imgCard = document.createElement("img");
    imgCard.classList.add("card-img-top");

    //div de body du card
    let divBodyCard = document.createElement("div");
    divBodyCard.classList.add("card-body");

    //titre du card
    let h5 = document.createElement("h5");
    h5.classList.add("card-title");

    //text du card
    let p = document.createElement("p");
    p.classList.add("card-text");

    //Coposition du card
    divCard.appendChild(imgCard);
    divCard.appendChild(divBodyCard);
    divBodyCard.appendChild(h5);
    divBodyCard.appendChild(p);
    divCol.appendChild(divCard);
    
    return divCol;
}

/**
 * Créer la structure HTML pour afficher une card à partir des paramètres pour personnaliser le numéro, l’image, le titre et la description
 * 
 * @author Amadou KOUYATE
 * @param {string} pNoModule nom de l'image du module qui sera transformé pour faire le numéro du module
 * @param {string} pImage image lié au module
 * @param {string} pTitre titre du module
 * @param {string} pDescription description du module
 */
function creerCards(pNoModule, pImage, pTitre, pDescription){
    //transformation du nom de l'image du module en numéro de module
    let numeroModule = pNoModule.substring(1, 3);

    //Générer un card et le remplir avec les éléments en paramètre
    let card = genererUnCard();

    let image = card.getElementsByTagName("img")[0];
    image.src = "../images/modules/" + pImage;
    image.alt  = pTitre;
    
    let titre = card.getElementsByTagName("h5")[0];
    titre.textContent = "MODULE " + numeroModule + " - " + pTitre;

    let description = card.getElementsByTagName("p")[0];
    description.textContent = pDescription.trim();

    let section = document.getElementById("modules-theorique");
    let row = section.querySelector(".row");

    row.append(card);
}

/**
 * @author Amadou KOUYATE
 * permet de remplir le select du formulaire avec les modules au chargement de la page
 */
function remplirSelectModules(){
    let select = document.getElementById("lstModule");

    for(let module of DATA_QUIZ.modules){
        let option = document.createElement("option");
        option.value = module.titre;
        option.textContent = module.titre;
        select.appendChild(option);
    }
}

/** 
 * Affiche les modules sous forme de cards selon le filtre ou non
 * @author Amadou KOUYATE
 * @param {Array} pDonnees liste des modules selon le filtre ou pas
 * @param {Boolean} pEstFiltreApplique vérifie si le filtre est appliqué ou pas
 */
function afficherModulesSelonFiltre(pDonnees, pEstFiltreApplique){
    let section = document.getElementById("modules-theorique");
    let row = section.querySelector(".row");

    //vider le contenu avant d'afficher les éléments
    row.innerHTML = "";

    if(pEstFiltreApplique){
        let select = document.getElementById("lstModule");
        let valeurSelect = select.value;
        for(let module of pDonnees.modules){
            if(module.titre == valeurSelect){
                creerCards(module.imgModule, module.imgModule, module.titre, module.description); 
                return false;
            }
        }
    }else{
        for(let module of pDonnees.modules){
            creerCards(module.imgModule, module.imgModule, module.titre, module.description);
        }
    }
}

/***
 * @author Amadou KOUYATE
 * Permet de filter le module
 */
function filtrerModules(e){
    e.preventDefault();

    if(validerFormulaireFiltre(e)){
        afficherModulesSelonFiltre(DATA_QUIZ, true);
    }
}

/**
 * @author Amadou KOUYATE
 * Permet d'afficher tous les cards si on actionne le button tout afficher
 */
function afficherTousCardsSiBoutonReset(){
    let select = document.getElementById("lstModule");
    select.classList.remove("is-invalid");
    select.classList.remove("is-valid");
    
    afficherModulesSelonFiltre(DATA_QUIZ, false);
}

/**
 * Créer des questionnaires selon le nombre de questions demandées
 * @author Amadou KOUYATE
 */
function creerQuestionnaire(e){
    e.preventDefault();
  
    if(validerFormulaireNbQuestion(e)){
        let inputNbQuestion = document.getElementById("nbQuestion");
        let nbQuestion = inputNbQuestion.value;

        let select = document.getElementById("lstModule");
        tableQuestions = [];

        //si aucun modul n'est selectionné
        if (select.value === "Choisir un module") {
            let banquesQuestions = DATA_QUIZ.banque_questions;

            while (tableQuestions.length < nbQuestion) {
                let question = banquesQuestions[Math.floor(banquesQuestions.length * Math.random())];
                
                // Vérifie si la question n'est pas présente avant de l'ajoutée
                if (!tableQuestions.includes(question)) {
                    tableQuestions.push(question);
                }
            }
          
        }else{
            
            //On récupère le module sélectionné
            let moduleSeletionne;
            for(let module of DATA_QUIZ.modules){
                if(module.titre == select.value){
                    moduleSeletionne = module;
                }
            }
           
            //On récupère l'image pour transformer en ID
            let moduleImage = (moduleSeletionne.imgModule).substring(1, 3);
            let moduleId = parseInt(moduleImage);
            
            //On parcours toutes les questions pour chercher celles qui appartiennent au module sélectionné
            let questions = [];
            for(let question of DATA_QUIZ.banque_questions){
                if(question.modulesId == moduleId){
                    questions.push(question);
                }
            }

           //On verifie si le nombre de questions disponibles est inférieur au nombre de questions démandées on ajuste
            if(nbQuestion > questions.length)
                nbQuestion = questions.length;

            //On trie les questions pour retourner le nombre de questions voulues 
            for(let i=0; i<nbQuestion; i++){
                tableQuestions.push(questions[i]);
            }
        }
        afficherQuestionSuivante(0);
    }
}


/**
 * @author Amadou KOUYATE
 * Fonction qui permet de créer le HTML de la question dont le numéro est passé en paramètre et en vérifiant si on doit créer des boutons radio ou des cases à cocher pour le type de réponse attendu
 * @param {int} pNumeroQuestion le numéro de la question 
 */
function afficherQuestionSuivante(pNumeroQuestion){
    
    //vider le contenu avant d'afficher les questions
    let sectionQuestions = document.getElementById("questionnaire");
    let card = sectionQuestions.querySelector(".card");
    card.innerHTML = "";

    //Réecupération de la question
    let laQuestion = tableQuestions[pNumeroQuestion];

    //Recuperation du titre de module
    let titreModuleConcerne; let numeroModule;
    for(let module of DATA_QUIZ.modules){
        let moduleImage = (module.imgModule).substring(1, 3);
        let moduleId = parseInt(moduleImage);

        if(moduleId == laQuestion.modulesId){
            titreModuleConcerne = module.titre;
            numeroModule = moduleImage;
        }
    }

    //Création des éléments HTML
    let h5 = document.createElement("h5");
        h5.classList.add("card-title");
        h5.textContent = "Question " + (pNumeroQuestion+1) + " (Module " + numeroModule + " " + titreModuleConcerne + ")";

    let divCardBody = document.createElement("div");
        divCardBody.classList.add("card-body");

    let p = document.createElement("p");
        p.classList.add("card-text");  
        p.textContent = laQuestion.titre;
        p.id = laQuestion.titre;
        
    

    let divContenuDansForm = document.createElement("div");
        divContenuDansForm.classList.add("row");  
    
    let divColMd6 = document.createElement("div");
        divColMd6.classList.add("col-md-6"); 
        divColMd6.id = "contenu-reponse";
        
    //Si le type de réponse attendue est radio bouton
    if(laQuestion.typeQuestion == "radio"){
        let spanTitre = document.createElement("span");
            spanTitre.classList.add("form-label"); 
            spanTitre.classList.add("mb-2"); 
            spanTitre.textContent = "Faites un choix *";
            divColMd6.appendChild(spanTitre);

        for(let i=0;i < laQuestion.choixReponses.length; i++){
            let divQuiContientRadio = document.createElement("div");
            divQuiContientRadio.classList.add("form-check"); 
            divQuiContientRadio.classList.add("mt-2"); 

            let inputRadio = document.createElement("input");
                inputRadio.classList.add("form-check-input");
                inputRadio.type = "radio";
                inputRadio.name = "reponse";
                inputRadio.id = laQuestion.choixReponses[i];
                inputRadio.value = laQuestion.choixReponses[i];

            let labelRadio = document.createElement("label");
                labelRadio.classList.add("form-check-label");
                labelRadio.for = laQuestion.choixReponses[i];
                labelRadio.textContent = laQuestion.choixReponses[i];

                //Création de l'élément input radio
                divQuiContientRadio.appendChild(inputRadio);
                divQuiContientRadio.appendChild(labelRadio);
            
                divColMd6.appendChild(divQuiContientRadio);
        }

    }

    //Si le type de réponse attendue est case à cocher 
    if(laQuestion.typeQuestion == "checkbox"){
        let spanTitre = document.createElement("span");
            spanTitre.classList.add("form-label"); 
            spanTitre.classList.add("mb-2"); 
            spanTitre.textContent = "Faites vos choix *";
            divColMd6.appendChild(spanTitre);

        for(let i=0;i < laQuestion.choixReponses.length; i++){
            let divQuiContientCheck = document.createElement("div");
            divQuiContientCheck.classList.add("form-check"); 
            divQuiContientCheck.classList.add("mt-4"); 

            let inputCheck = document.createElement("input");
            inputCheck.classList.add("form-check-input");
            inputCheck.type = "checkbox";
            inputCheck.name = "reponses[]";
            inputCheck.value = laQuestion.choixReponses[i];
            inputCheck.id = laQuestion.choixReponses[i];
            
            let labelCheck = document.createElement("label");
            labelCheck.classList.add("form-check-label");
            labelCheck.for = laQuestion.choixReponses[i];
            labelCheck.textContent = laQuestion.choixReponses[i];

            //Création de l'élément input check
            divQuiContientCheck.appendChild(inputCheck);
            divQuiContientCheck.appendChild(labelCheck);

            divColMd6.appendChild(divQuiContientCheck);
        }
    }

    let bouton = document.getElementById("btn-reponse");
        bouton.disabled = false;

    if(tableQuestions.length == (pNumeroQuestion+1))
        bouton.textContent = "Terminer le questionnaire";
    else
        bouton.textContent = "Valider et passer à la question suivante > ";

    card.appendChild(h5);
    divCardBody.appendChild(p);
    divCardBody.appendChild(divColMd6);
    card.appendChild(divCardBody);
}

/**
 * Permet de créer et afficher un toast
 * @author Amadou KOUYATE
 * 
 * @param {string} pId Id du toast
 * @param {string} pTitre le titre le contenu HTML 
 * @param {string} pElementHTMLContenu le contenu HTML
 * @param {int} pTemps le temps en millisecondes
 */
function afficherToast(pId, pTitre, pElementHTMLContenu, pTemps){
    // Récupération du Toast.
    let toastExemple = document.getElementById(pId);
    let titreToaster = toastExemple.querySelector(".toast-header");
        titreToaster.classList.add("bg-white");
        titreToaster.classList.add("text-dark");

    let titreToasterContant = toastExemple.querySelector("strong.me-auto");
        titreToasterContant.classList.add("h4");
        titreToasterContant.classList.add("ms-4");
        titreToasterContant.classList.add("bg-white");
        titreToasterContant.textContent = pTitre;

    let toastBody = toastExemple.getElementsByClassName("toast-body")[0];
    
    //On vide son contenu avant de le reconstituer
    toastBody.innerHTML = "";

    toastBody.classList.add("bg-white");

    let p = document.createElement("p");
    p.className = "text-secondary-emphasis p-1 fs-6";

    let div = document.createElement("div");
        div.role = "alert";

    if(pTitre == "Avertissement"){
        p.textContent = pElementHTMLContenu;
        div.className = "alert alert-warning"; 
        div.appendChild(p);
        toastBody.appendChild(div);
    }

    if(pTitre == "Rétroaction positive"){
        p.textContent = pElementHTMLContenu;
        div.className = "alert alert-success"; 
        div.appendChild(p);
        toastBody.appendChild(div);
    }
     
    if(pTitre == "Rétroaction négative"){
        p.textContent = pElementHTMLContenu;
        div.className = "alert alert-danger"; 
        div.appendChild(p);
        toastBody.appendChild(div);
    }

    // Options du Toast.
    let optionsToast = {
        delay: pTemps,
        animation: true,
        autohide: true
    };

    // Création du Toast.
    new bootstrap.Toast(toastExemple, optionsToast).show();
}

/**
 * @author Amadou KOUYATE
 * Vérifie si la réponse est bonne, calcule les points 
 */
function validerReponse(e){
    e.preventDefault();
    //recuperation de la question 
    let form = document.getElementById("formQuestions");
    let p = form.querySelector(".card .card-body p");
    let questionPosee = p.textContent;

    // Récupérer le conteneur des réponses
    let contenuReponse = document.getElementById("contenu-reponse");

    // Récupérer tous les éléments <input> à l'intérieur du conteneur
    let inputs = contenuReponse.querySelectorAll("input");

    //verification du type de bouton
    let typeButtoon = null; //Par défaut

    //Déclaration des variables qui vont verifier si un choix a été fait pour le radio 
    let choixFait = false; // Par défaut
    let indexChoisi = null; // Par défaut aucun choix

    //Déclaration des variables qui vont verifier si un choix a été fait pour le checkbox 
    let valeursChoisies = []; // Par défaut
    let indexesChoisis = []; // Par défaut aucun choix

    //Parcourir chaque élément <input> pour voir si c'est un chekbox ou un radio
    for (let j = 0; j < inputs.length; j++) {
        let input = inputs[j];
    
        if (input.type === "radio") {
            typeButtoon = input.type;
            valeursChoisies = [];

            // Récupérer tous les boutons radio du groupe "reponse"
            let radiosReponses = document.getElementsByName("reponse");
            for (let i = 0; i < radiosReponses.length; i++) {
                if (radiosReponses[i].checked) {
                    choixFait = true;
                    valeursChoisies.push(radiosReponses[i].value);
                    indexChoisi = i;
                    break; // Sort de la boucle dès qu'un choix est trouvé car un radio a un seul choix
                }
            }
        }

        if (input.type === "checkbox") { 
            typeButtoon = input.type;
            valeursChoisies = [];

            //Récupérer toutes les cases à cocher dans le formulaire
            let checkboxes = document.querySelectorAll("input[type='checkbox'][name='reponses[]']");
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    valeursChoisies.push(checkboxes[i].value);
                    indexesChoisis.push(i);
                }
            }
        }
    }

    //Si c'est un bouton radio
    if(typeButtoon!=null && typeButtoon === "radio"){
        if(choixFait){
            //S'il y a un choix on verifie la réponse pour retourner une retroaction
            for (let question of tableQuestions) {
                if (question.titre == questionPosee) {
                    question.reponsesUtilisateur = valeursChoisies;
            
                    if (question.reponses[0] == indexChoisi) {
                        afficherRetroaction(true, question.retroactionPositive);
                        question.pointageQuestion = 1;
                    } else {
                        afficherRetroaction(false, question.retroactionNegative);
                        question.pointageQuestion = 0;
                    }
                }
            }
            
        }else{
            afficherToast("toast-exemple", "Avertissement", "Vous devez faire un choix avant de valider !", 3000);
            return false;
        }
    }

    //Si c'est un chekbox
    if(typeButtoon!=null && typeButtoon === "checkbox"){
        if(indexesChoisis.length>0){
            //S'il y a un choix on verifie la réponse pour retourner une retroaction
            for (let question of tableQuestions) {
                if (question.titre == questionPosee) {
                    question.reponsesUtilisateur = valeursChoisies;
            
                    if (question.reponses[0] == indexChoisi) {
                        afficherRetroaction(true, question.retroactionPositive);
                        question.pointageQuestion = 1;
                    } else {
                        afficherRetroaction(false, question.retroactionNegative);
                        question.pointageQuestion = 0;
                    }
                }
            }

        }else{
            afficherToast("toast-exemple", "Avertissement", "Vous devez faire un choix avant de valider !", 3000);
            return false;
        }
    }


   
    //On prépare le popover a l'avant dernière question
    if((tableQuestions.length >1) && (tableQuestions[tableQuestions.length - 2].titre == questionPosee)){
        creerPoppover("contenu-popover","btn-reponse","Fin du questionnaire");
    }

    //On verifie si nous sommes au derniers element du tableau pour terminer le questionnaire
    let dernierIndex = tableQuestions.length - 1;
    if(tableQuestions[dernierIndex].titre == questionPosee){
        terminerQuestionnaire();
    }else{
        let indexActuel = -1;
        for (let i = 0; i < tableQuestions.length; i++) {
            let question = tableQuestions[i];
            if (question.titre === questionPosee) {
                indexActuel = i; 
                break; 
            }
        }
        afficherQuestionSuivante(indexActuel+1);
    }
}

/**
 * @author Amadou KOUYATE
 * Va chercher la rétroaction de la réponse (bonne ou mauvaise) et l’affiche dans un toast
 * @param {boolean} pEstPositif indique si la rétroaction est positive ou non
 * @param {string} pRetroaction indique le message afficher pour la rétroaction
 */
function afficherRetroaction(pEstPositif, pRetroaction){
    if(pEstPositif)
        afficherToast("toast-exemple", "Rétroaction positive",pRetroaction, 4000);
    else
        afficherToast("toast-exemple", "Rétroaction négative",pRetroaction, 4000);
}

/**
 * @author Amadou KOUYATE
 * Active le bouton Mes réponses, désactive le bouton Valider/passer à la question suivante, efface le contenu de la section zone de questions du questionnaire
 */
function terminerQuestionnaire()
{
    let boutonConsulterReponse = document.getElementById("consulter-reponses");
        boutonConsulterReponse.disabled = false;
    
    let btnReponse = document.getElementById("btn-reponse");
        btnReponse.disabled = true;
    
    let sectionQuestions = document.getElementById("questionnaire");
    let card = sectionQuestions.querySelector(".card");
        card.innerHTML = "";
    
    remplirOffCanvas();
} 


/*************
    Cette fonction est rattachée à l'événement "Load". 
    C'est la première fonction qui va s'executer lorsque 
    la page sera entièrement chargée.
**************/
function initialisation() {
    //Chargement des modules dans le select
    remplirSelectModules();
    
    //Affichage de tous les modules dans la section module
    afficherModulesSelonFiltre(DATA_QUIZ,false);
    
    //Affichage des modules selon le filtre
    let formFiltre = document.getElementById("form-filtre");
    formFiltre.addEventListener("submit", filtrerModules);

    //Affichage de tous les modules lors du click du bouton reset de filtre
    let btnReset = document.getElementById("btn-reset");
    btnReset.addEventListener("click", afficherTousCardsSiBoutonReset);

    //Création des questionnaires 
    let formCreerQuestionnaire = document.getElementById("form-creer-questionnaire");
    formCreerQuestionnaire.addEventListener("submit", creerQuestionnaire);

    //Valider réponse
    let formQuestions = document.getElementById("formQuestions");
    formQuestions.addEventListener("submit", validerReponse);
}

addEventListener("DOMContentLoaded", initialisation, false);