 const requestHeader = new XMLHttpRequest()
 const requestMainHeader = new XMLHttpRequest()
 const requestFooterScript = new XMLHttpRequest()
 const requestMetaData = new XMLHttpRequest()
 include('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js');
 requestInfo();
 var articleArray = [];
 var programmingArray = [],
     devopsArray = [],
     blockchainArray = [],
     bigdataArray = [];
 async function requestInfo() {
     // Layout fragment raw JS without helper library xD, it's a dirty code but that's okay, thanks for inspecting...
     // Request for head tag
     await makeRequest("GET", "/template/head.html").then((data) => {
         let loaderStyle = document.getElementById("loader-style")
         loaderStyle.insertAdjacentHTML("beforeBegin", data);
     })

    await makeRequest("GET", "/manifest/devops.json").then((data) => {
        articleArray = articleArray.concat(JSON.parse(data))
    })
    await makeRequest("GET", "/manifest/blockchain.json").then((data) => {
        articleArray = articleArray.concat(JSON.parse(data))
    })
    await makeRequest("GET", "/manifest/bigdata.json").then((data) => {
        articleArray = articleArray.concat(JSON.parse(data))
    })

     // Request for article meta data
     await makeRequest("GET", "/manifest/programming.json").then((data) => {
        articleArray = articleArray.concat(JSON.parse(data))
        articleArray.forEach((data) => {
             switch (data['category']) {
                 case 'programming':
                     programmingArray.push(data);
                     break;
                 case 'devops':
                     devopsArray.push(data);
                     break;
                 case 'blockchain':
                     blockchainArray.push(data);
                     break;
                 case 'bigdata':
                     bigdataArray.push(data);
                     break;
                 default:
                     console.log(article['categoty'])
             }
         })
         generateCard(programmingArray, "programming-row");
         generateCard(devopsArray, "devops-row");
         generateCard(blockchainArray, "blockchain-row");
         generateCard(bigdataArray, "bigdata-row");
     })

     // Request for footer script
     await makeRequest("GET", "/template/script.html").then((data) => {
         let lines = data.split("\n")
         lines.forEach((url) => {
             let script = document.createElement('script');
             script.type = 'text/javascript';
             script.src = url;
             document.body.appendChild(script);
         })
     })

     //  Request sidebar
     await makeRequest("GET", "/template/sidebar.html").then((data) => {
         let mainSidebar = document.getElementById("main-sidebar")
         mainSidebar.innerHTML = "";
         mainSidebar.innerHTML += data;
     }).then(() => {
         let theUL = document.getElementById("tag-list-ul");
         var tags = [];
         articleArray.forEach((data) => {
             tags.push(...data['tag'])
         })
         tags = [...new Set(tags)].map(v => v.toLowerCase());
         tags.forEach((tag) => {
             theUL.innerHTML += `<li><a href='/tag.html?id=${tag}'>#${tag}</li>`;
         })

     })

     // Request for header block
     await makeRequest("GET", "/template/header.html").then((data) => {
         let mainHeader = document.getElementById("main-header")
         mainHeader.innerHTML = "";
         mainHeader.innerHTML += data;
         setTimeout(() => {
             document.getElementById("loader-wrapper").style.display = "none"
         }, 1000)
     })
 }

 // Make http request
 function makeRequest(method, url) {
     return new Promise(function (resolve, reject) {
         let xhr = new XMLHttpRequest();
         xhr.open(method, url);
         xhr.onload = function () {
             if (this.status >= 200 && this.status < 300) {
                 resolve(xhr.response);
             } else {
                 reject({
                     status: this.status,
                     statusText: xhr.statusText
                 });
             }
         };
         xhr.onerror = function () {
             reject({
                 status: this.status,
                 statusText: xhr.statusText
             });
         };
         xhr.send();
     });
 }

 // Include js file
 function include(file) {
     var script = document.createElement('script');
     script.src = file;
     script.type = 'text/javascript';
     script.defer = true;
     document.getElementsByTagName('head').item(0).appendChild(script);
 }


 // Generate article card
 function generateCard(arrayVar, divClass) {
     arrayVar = (arrayVar.length < 9) ? arrayVar : arrayVar.slice(0, 8);
     arrayVar.forEach((data) => {
         let article = `<div class="col-md-3 mb-3">
                <div class="card blog-post-card">
                    <div style="overflow:hidden">
                        <img class="card-img-top" 
                        src = "${(data["thumbnail"]  == undefined )? "/assets/images/placeholder.jpg" : data['thumbnail']}" 
                        onerror="this.src = '/assets/images/placeholder.jpg';"
                        >
                    </div>   
                    <div class="card-body">
                        <h5 class="card-title" id="article-title"><a class="theme-link" href="/pages/${data.category}/${data.id}.html">${data['title']}</a></h5>
                    </div>
                </div>
            </div>`;
         document.getElementById(divClass).innerHTML += article;
     })
 }