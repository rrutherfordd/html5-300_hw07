//window.alert("Assignment 7");

/*global $*/

/*
  SimpleLocalStorageDB.js

  Maintains in-memory database. Implements add, edit, and delete.
  Reads from and writes to localStorage.
*/
/*
(function () {
  'use strict';
*/
//=============================================================================

var people, ITEMS_KEY, nextId, BASE_URL, collection;

people = [];
ITEMS_KEY = 'LSDB_items';
nextId = 1000;
BASE_URL = 'https://pacific-meadow-64112.herokuapp.com/data-api/rrutherford';
collection = 'rrutherford';


//=============================================================================

function getPeople() {
  'use strict';
  //---------------------------------------------------------------------
  function getNextId() {
    var maxId = 1000;
    people.forEach(function (person) {
      if (+person.pid > maxId) {
        maxId = +person.pid;
      }
    });
    return maxId + 1;
  }
  //---------------------------------------------------------------------    
  try {
    var peopleString = localStorage[ITEMS_KEY];
    if (peopleString) {
      people = JSON.parse(peopleString);
      nextId = getNextId();
    }
  } catch (excptn) {
    window.console.error('Unable to read or parse localStorage items');
  }
}

//=============================================================================

function displayPeople() {
  'use strict';
  var i, len, person, tr, td, button;

  $('#people').empty();

  for (i = 0, len = people.length; i < len; i = i + 1) {
    person = people[i];

    tr = $('<tr data-id="' + person.pid + '">');

    td = $('<td>');
    td.text(person.name);
    tr.append(td);

    td = $('<td>');
    td.text(person.age);
    tr.append(td);

    td = $('<td>');
    button = $('<button type="button" class="edit">');
    button.text('Edit');
    td.append(button);
    button = $('<button type="button" class="delete">');
    button.text('Delete');
    td.append(button);
    tr.append(td);

    $('#people').append(tr);
  }

  //$('#table-page').show();
  //$('#form-page').hide();
}

//-----------------------------------------------------------------------------

function indexOfEventPerson(evt) {
  'use strict';
  var btn = evt.target, tr = $(btn).closest('tr'), id = tr.attr('data-id'), i, len;

  for (i = 0, len = people.length; i < len; i = i + 1) {
    if (people[i].pid === id) {
      return i;
    }
  }
  return -1;
}
//-----------------------------------------------------------------------------
function reportAjaxError(jqXHR, textStatus, errorThrown) {
  'use strict';
  var msg = 'AJAX error.\n' +
      'Status Code: ' + jqXHR.status + '\n' +
      'Status: ' + textStatus;
  if (errorThrown) {
    msg += '\n' + 'Error thrown: ' + errorThrown;
  }
  if (jqXHR.responseText) {
    msg += '\n' + 'Response text: ' + jqXHR.responseText;
  }
  $('#response').text(msg);
}

//-----------------------------------------------------------------------------
function reportResponse(response) {
  'use strict';
  $('#response').text(JSON.stringify(response, null, 4));
}

//-----------------------------------------------------------------------------
function clearReport() {
  'use strict';
  $('#response').empty();
}

//-----------------------------------------------------------------------------
function getListOfPeople() {
  'use strict';
  clearReport();
  $.ajax(BASE_URL,
    {
      method: 'GET',
      success: reportResponse,
      error: reportAjaxError
    });
}

//-----------------------------------------------------------------------------  
function handleReadList(evt) {
  'use strict';
  window.alert("made it to handleReadList");
  evt.preventDefault();
  getListOfPeople();
}


//-----------------------------------------------------------------------------
function createPerson(evt) {
  'use strict';
  evt.preventDefault();
  var name, age, person;
  //$('#table-page').hide();
  //$('#form-page').show();
  name = $('#create-name').val();
  age = $('#create-age').val();
  person = {
    name: name,
    age: age
  };
  window.alert("got person? " + person.name + ' ' + person.age);
  clearReport();
  $.ajax(BASE_URL,
    {
      type: 'POST',
      data: person,
      success: reportResponse,
      error: reportAjaxError
    }
    );
}
//=============================================================================

function addOrEditPerson(person) {
  'use strict';
  //=========================================================================
  function addOrUpdatePerson(evt) {
    evt.preventDefault();
    var newPerson, name, age;
    if (person) {
      name = $('#name').val();
      age = $('#age').val();
    } else {
      //nextId = nextId + 1;
      newPerson = {
        //pid: (nextId).toString(),
        name: $('#name').val(),
        age: $('#age').val()
      };
      //people.push(newPerson);
    }
    //localStorage[ITEMS_KEY] = JSON.stringify(people);
    createPerson(newPerson);
    //displayPeople();
    handleReadList();
  }
  //=========================================================================    
  if (person) {
    $('#name').val(person.name);
    $('#age').val(person.age);
  } else {
    $('#name').val('');
    $('#age').val('');
  }
  $('#submit').one('click', addOrUpdatePerson);
  $('#cancel').one('click', displayPeople);

  //$('#table-page').hide();
  //$('#form-page').show();
}

//-----------------------------------------------------------------------------
function confirmAndDeletePerson(evt) {
  'use strict';
  //-------------------------------------------------------------------------
  function deletePerson(idx) {
    people.splice(idx, 1);
    localStorage[ITEMS_KEY] = JSON.stringify(people);
  }
  //-------------------------------------------------------------------------    
  var i = indexOfEventPerson(evt);
  if (i >= 0) {
    if (window.confirm('Are you sure you want to delete "' +
                           people[i].name + '"?')) {
      deletePerson(i);
      displayPeople();
    }
  }

}

//=============================================================================
function editPerson(evt) {
  'use strict';
  var i = indexOfEventPerson(evt);
  if (i >= 0) {
    addOrEditPerson(people[i]);
  }
}

//=============================================================================
function addNewPerson(evt) {
  'use strict';
  evt.preventDefault();
  window.alert("made it to addNewPerson");
  var name, age, person;
  //$('#table-page').hide();
  //$('#form-page').show();
  name = $('#create-name').val();
  age = $('#create-age').val();
  person = {
    name: name,
    age: age
  };
  window.alert("got person? " + person.name + ' ' + person.age);
  $('#submit').one('click', createPerson(person));
  $('#cancel').one('click', handleReadList());
  
}

//-----------------------------------------------------------------------------  
function getPerson(id) {
  'use strict';
  clearReport();
  $.ajax(BASE_URL + '/' + id,
    {
      method: 'GET',
      success: reportResponse,
      error: reportAjaxError
    });
}

//=============================================================================
$('#new-person').on('click', addNewPerson);
$('#people').on('click', '.edit', editPerson);
$('#people').on('click', '.delete', confirmAndDeletePerson);
$('#submit').on('click', createPerson);
$('#cancel').on('click', handleReadList);

//=============================================================================
$('#table-page').show();
$('#form-page').show();
//getPeople();
//displayPeople();
/*
})();
*/