let row = document.getElementById('data');
let selectedImages = [];
let imageTotla = 0;
let ImagesObjects = [];
let imageSizes = [];
let sizesCount = {};
let loadedImages = 0;
let base = [];
let sizes = [];
const minSizeCount = 5;
let title = "all";

let sellectAll = document.querySelector('#selectAll');
let download = document.querySelector('#download');

// select the div to put the user total selected items
let totalDiv = document.querySelector("#total");
let card;

let waitingImage;
let ProgressCounter;

// trime array and remove all the empty elements
function trimeArray(data){
    // console.log('Value currently is ' + result.key);
    let dataa = data.savedImages.filter(function(url){
        return url.trim().length > 0;
    });
    return dataa;
}

// set up data and create image nods and add theme to the template
function setup(data){
    data.forEach((element,index) => {
        
        // create the container div
        let containner = document.createElement('div');
        containner.classList.add('col-lg-3');

        // creat the card that holds the image
        let cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // create the image skylton
        let image = document.createElement('img');
        image.src = element;
        image.setAttribute("id", "img_"+index);
        // image.setAttribute("crossorigin", "anonymous");
        image.classList.add('card-img-top');
        image.classList.add('img-fluid');
        // image.setAttribute('crossorigin', 'anonymous');
        image.onload = function(){
            // imageSizes.push(this.naturalWidth+"x"+this.naturalHeight);
            loadedImages++;
            this.setAttribute('width',this.naturalWidth);
            this.setAttribute('height',this.naturalHeight);
            if(loadedImages == imageTotla){
                setUpIMageSizeArray();
            }
        }


        // add the image to the card div
        cardDiv.appendChild(image);
        // thene append carddiv to the containner div
        containner.appendChild(cardDiv);
        // then append all the row
        row.appendChild(containner);

    });
    card = document.querySelectorAll('.card');
    card.forEach(element => {
        element.addEventListener('click',function(){
            this.classList.toggle('card-selected');
            let imag = this.querySelector('img');
            if(element.classList.contains('card-selected')){
                selectedImages.push(imag.getAttribute("id"));
            }else{
                selectedImages = selectedImages.filter(function(el){
                    return el !== imag.getAttribute("id");
                });
            }

            totalDiv.innerText = selectedImages.length+"/"+imageTotla;
            // show the array
            // console.log(selectedImages);
        })
    });
}


function selectSingle(img){
    // desilectAll();
    // check if image already selected
    if(!img.parentElement.classList.contains('card-selected')){
        img.parentElement.classList.toggle('card-selected');
        if(img.parentElement.classList.contains('card-selected')){
            selectedImages.push(img.getAttribute("id"));
        }else{
            selectedImages = selectedImages.filter(function(el){
                return el !== img.getAttribute("id");
            });
        }
        
        totalDiv.innerText = selectedImages.length+"/"+imageTotla;
    }
}

function desilectAll(){
    card.forEach(element => {
        selectedImages = []
        element.classList.remove('card-selected');
        
        totalDiv.innerText = selectedImages.length+"/"+imageTotla;
        // show the array
        // console.log(selectedImages);
    });
}


function setUpIMageSizeArray(){
    let sizecontainer = document.querySelector('#sizeContainer');
    let imgs = document.images;
    for(let i=0;i<imgs.length;i++){
        imageSizes.push(imgs[i].naturalWidth+"x"+imgs[i].naturalHeight);
    }

    imageSizes.forEach(function(x) { sizesCount[x] = (sizesCount[x] || 0)+1; });

    Object.entries(sizesCount).forEach((val,key)=>{
        if(val[1] > 5){
            sizes.push(val[0]);
            // add the sizes to the view
            let div = document.createElement('div');
            div.innerText = val[0];
            
            let input = document.createElement('input');
            input.setAttribute('type','radio');
            input.setAttribute('name','imagesize');
            input.setAttribute('id','imagesize');
            input.setAttribute('value',val[0]);

            input.addEventListener('click',function(){
                // alert('selct size has been selected');
                // desilectAll();
                let images = document.querySelectorAll('img');
                let dimentions = this.value;
                let width = dimentions.split('x')[0];
                let height = dimentions.split('x')[1];
                
                images.forEach(element => {
                    // console.log(element.getAttribute('width')+"x"+element.getAttribute('height'));
                    if(element.getAttribute('width') == width && element.getAttribute('height') == height){
                        selectSingle(element);
                    }else if(element.getAttribute('width') == 0 && element.getAttribute('height') == 0){
                        selectAllImages();      
                    }
                });
            })
            
            div.appendChild(input);
            sizecontainer.appendChild(div);
            
            //<div><input type="radio" checked name="imagesize" value="0x0" class="" />All </div>

        }
    });

    // console.log(sizes);
}



chrome.storage.local.get(['savedImages'], function(result) {
    
    let data = trimeArray(result);
    // set up image count
    imageTotla = data.length;
    totalDiv.innerText = "0/"+imageTotla;

    const promise = new Promise((resolve,reject)=>{
        resolve(setup(data));
    });

    promise.then((val)=>{
        // getSizesCount();
        
        
    });
    
    // set up and fill the sizes array

    // console.log(ImagesObjects);
});


function selectAllImages(){
    if(selectedImages.length == imageTotla){
        selectedImages = [];
        ImagesObjects = [];
        
        card.forEach(element => {
            element.classList.remove('card-selected');
    
            totalDiv.innerText = "0/"+imageTotla;
            sellectAll.innerText = "Select All";
        });
    }else{
        selectedImages = [];
        ImagesObjects = [];
        
        card.forEach(element => {
            element.classList.remove('card-selected');
            element.classList.add('card-selected');
            let imag = element.querySelector('img');
            if(element.classList.contains('card-selected')){
                selectedImages.push(imag.src);
            }
    
            totalDiv.innerText = selectedImages.length+"/"+imageTotla;
            sellectAll.innerText = "unselect All";
        });
    }
    
}

// not working
// TODO: this function is no longer used
// function getBase64Image(img) {
//     var canvas = document.createElement("canvas");
//     var image = new Image();
//     image.src = img.src;
//     image.setAttribute('crossorigin', 'anonymous')
//     canvas.width = img.width;
//     canvas.height = img.height;
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(image, 0, 0);
//     var dataURL = canvas.toDataURL("image/png");
//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
//   }

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
        callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


// create all the files and convert theme to base64
// thene download the files
function createBaseFiles(){
    let images = [];
    base = [];
    selectedImages.forEach(element => {
        document.querySelector('#'+element).setAttribute('crossorigin', 'anonymous')
        images.push(document.querySelector('#'+element));
    });
    images.forEach(element => {
        // ImagesObjects.push(getBase64Image(element));
        toDataURL(element.src, function(dataUrl) {
            // console.log('RESULT:', dataUrl);
            base.push(dataUrl);
            if(base.length == images.length){
                let counter =0;
                // create archive before loading process begin
                var zip = new JSZip();
                // add image file to the zip
                
                base.forEach((i,e) => {
                    // console.log(e);
                    zip.file("IMG_"+e+".png", base[e].split(',')[1],{base64:true});
                    
                    ProgressCounter.innerText = (Math.floor(++counter*100)/selectedImages.length)+" %";
                });

                // create the zip object
                zip.generateAsync({type:"blob"}).then(function(content) {
                    // save out
                    let href = (URL || webkitURL).createObjectURL(content);
                    // lnk.innerHTML = "Right-click + Save as to download zip file";
                    // lnk.download = "DemoZip.zip";
                    chrome.downloads.download({url:href,filename:title+".zip"});
                    // console.log(href);
                    waitingImage.classList.add('invisible');
                    ProgressCounter.innerText = "0 %";
                    ProgressCounter.classList.add('invisible');
                });
                
            }
            // console.log(base[0]);

            
        })
        
    })

}

function downloadData(){
    ImagesObjects = [];
    if(selectedImages.length > 0 ){
        // selectedImages.forEach(element =>{
        //     document.querySelector('#'+element).setAttribute('crossorigin', 'anonymous')
        //     images.push(document.querySelector('#'+element));
        // });


        // const generatePromise = new Promise((resolve,reject)=>{
        //     resolve(createBaseFiles());
        // });
    
        // generatePromise.then((val)=>{
        //     // getSizesCount();
        //     console.log(base);
            
        // });
        waitingImage = document.querySelector("#waiting");
        ProgressCounter = document.querySelector("#proCounter");
        waitingImage.classList.remove('invisible');
        ProgressCounter.classList.remove('invisible');        

        createBaseFiles();

    }else{
        alert('No Selected Image');
    }
    
}


sellectAll.addEventListener('click',selectAllImages);
download.addEventListener('click',downloadData);


document.body.onload = function(){
    // alert("the function is done loading");
    chrome.storage.local.get(['title'], function(result) {
      title = result.title;
    });
}


