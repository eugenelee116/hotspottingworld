function initUpload(){
  
  var data=[],
  input = $('#input-image'),
  thumbInput = $('#input-thumb'),
  preview = $('#preview'),
  previewImage = $('<img id="preview-image" />'),
  thumbPreview = $('#thumb-preview'),
  previewThumb = $('#preview-thumb'),
  output = $('#output'),
  outputOptionMinify = $('#output-opt-minify');

  input.change(function() {
    var el=input.get(0);
    if(el.files.length>0){
      loadPreview(el.files[0])
        
    }
  });

  thumbInput.change(function() {
    var el=thumbInput.get(0);
    if(el.files.length>0){
      loadThumb(el.files[0])
        
    }
    console.log(el);
  });

  outputOptionMinify.on('change',function(){
    printData();
  });

  function loadPreview(file){
    var i= 0,
    reader=new FileReader();

    reader.onloadend=function(){
      while(preview.children().length){
        preview.children().remove();
      }
      var img=new Image();
      img.src=reader.result;
      previewImage.attr('src', img.src);
      preview.append(previewImage);
      //preview.append(img);
      //$('#image-preview').attr('src', img.src);

      var taggd=preview.children().taggd(getOptions(),[]);
      //var taggd = $('#image-preview').taggd(getOptions(),[]);
      taggd.on('change',function(){
        data=taggd.data;
        printData();
      });

    };
    reader.readAsDataURL(file);
  }

  function loadThumb(file){
    var i= 0,
    reader=new FileReader();

    reader.onloadend=function(){
      /*while(thumbPreview.children().length){
        thumbPreview.children().remove();
      }*/
      var img=new Image();
      img.src=reader.result;
      previewThumb.attr('src', img.src);
      //thumbPreview.append(img);

    };
    reader.readAsDataURL(file);

    console.log(file);
  }

  function getOptions(){
    return{
      align:{
        x:'center',y:'center'
      },
      offset:{
        left:0,
        top:70
      },
      edit:true
    };
  };

  function printData(){
    var json=null;
    //var minify=outputOptionMinify.get(0).checked;
    //if(minify)json=JSON.stringify(data);else json=JSON.stringify(data,null,'\t');
    json=JSON.stringify(data);
    output.val(json);
  };
}

function clearUpload(){
	$('#preview').html('');
	//.remove();
	$('#upload-thumb').attr('src', '');
}