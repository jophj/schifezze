var AddSchifezzaFormController = function(username){

  var valueElement = document.getElementById('value-'+username);
  var commentElement = document.getElementById('comment-'+username);
  var submitButtonElement = document.getElementById('submit-button-'+username);

  valueElement.addEventListener('change', handleValueChange);
  document.getElementById('form-' + username).addEventListener('submit', addSchifezza);
  submitButtonElement.addEventListener('click', addSchifezza);

  function validateValue(v){
    var numberRegex = /^(\d+(?:[.]\d+)?)$/;
    return numberRegex.test(v);
  }

  function validateComment(comment){
    return comment.length > 0 || false;
  }

  function formIsValid(value, comment){
    return validateValue(value) && validateComment(comment);
  }

  function handleValueChange(e){
    if(validateValue(e.target.value)){
      valueElement.classList.remove('invalid');
      valueElement.classList.add('valid');
    }
    else{
      valueElement.classList.remove('valid');
      valueElement.classList.add('invalid');
    }
  }

  function handleCommentChange(e){

    if(validateComment(e.target.value)){
      commentElement.classList.remove('invalid');
      commentElement.classList.add('valid');
    }
    else{
      commentElement.classList.remove('valid');
      commentElement.classList.add('invalid');
    }

    return false;
  }

  function addSchifezza(e){
    e.preventDefault();
    var value = valueElement.value;
    var comment = commentElement.value;

    if (formIsValid(value, comment)){
      $.post('api/schifezze', {username: username, value: value, comment: comment}, function(res){
        if (res === 'OK'){
          location.reload();
        }
      });
    }

    return false;
  }

  return {
    addSchifezza: addSchifezza,
    handleValueChange: handleValueChange
  }
};