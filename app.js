// Recuperation de toutes les balise html qui seront utilisées pour l'html
const temperature = document.querySelector("#temperature");
const horaire = document.querySelector("#horaire");
const humidity = document.querySelector("#humidity");
const condition = document.querySelector("#condition");
const place = document.querySelector("#location");
const imgMeteo = document.querySelector(".information img");

// appel de la function getInput() au chargement de la page;
window.onload = function() {
  getInput();
};

function getInput() {
  // On recupere la value de l'input
  let inputValue = document.querySelector("input").value;
  // axios.all permet de faire plusieurs requete en une seule
  axios
    .all([
      // appel de l'api météo
      axios.get(
        `https://api.apixu.com/v1/current.json?key=25aff8fbdd17436eb17103421192305&q=${inputValue ||
          "Paris"}&lang=fr`
      ),
      // appel de l'api news
      axios.get(
        `https://newsapi.org/v2/everything?q=$%7B${inputValue ||
          "paris"}&from=2019-04-29&sortBy=publishedAt&apiKey=7324eecf823242b1bbe90be95bc85914`
      )
    ])
    // Retour de la reponse // success
    // Si une response est renvoyé par la requete ALORS on rentre dans le "then"
    .then(
      // axios.all = axios.spread permet de recuperer plusieur response
      axios.spread(function({ data }, news) {
        // Meteo
        // remettre la value de l'input a 0
        document.querySelector("input").value = "";
        // Insertion de la temperature
        temperature.innerHTML = data.current.temp_c + " C°";
        // Insertion de la ville + le pays
        place.innerHTML = `${data.location.name}, ${data.location.country}`;
        // Insertion de la humidity
        humidity.innerHTML = data.current.humidity + "%";
        // Insertion de la condition
        condition.innerHTML = data.current.condition.text;
        // Insertion du src dans l'image
        imgMeteo.setAttribute("src", `http:${data.current.condition.icon}`);
        // creation d'une variable contenant l'heure de la ville selectionnée
        let time = new Date().toLocaleString("en-GB", {
          timeZone: data.location.tz_id
        });
        // Insertion de l'heure dans l'html + slice de la string pour ne recuperer que l'heure
        horaire.innerHTML = time.slice(12, -3);

        // News
        // Vider les informations avant de les réafficher dans l'html
        document.querySelector(".actualite").innerHTML = "";
        // Parcourir tous les element avec map
        // Slice pour recuperer seulement les 6 premiers element
        news.data.articles.slice(0, 6).map((element, index) => {
          // Essaye de console.log(element) pour ce que renvoie element
          // Creation d'une balise <article></article>
          let createArticle = document.createElement("article");
          // Creation du contenu de la balise <article></article>
          // Si aucune url n'est renvoyé pour l'img on l'a remplace par une img contenant un ?
          let articleContent = `
            <h2>${element.title}</h2>
            <img src=${element.urlToImage ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/1280px-Flag_of_None.svg.png"} />
            <p>${element.content}</p>
          `;
          // Remplir <article></article> par la variable articleContent
          createArticle.innerHTML = articleContent;
          // createArticle contient desormais =
          // <article>
          //   <h2>titre du post</h2>
          //   <img src="url de l'image" />
          //   <p>descrption de l'article</p>
          // </article>

          // Rajout de createArticle dans la balise <section class="actualite"></section> se trouve dans l'html
          document.querySelector(".actualite").appendChild(createArticle);
        });
      })
    )
    // si la requete axios renvoie une erreur
    .catch(function(error) {
      // informe l'utilisateur de l'erreur via un alert
      alert("marche pas");
      // affiche l'erreur dans la console
      console.log(error);
    });
}
