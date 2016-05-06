angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('TodoListController', ["$scope", "NoteStore", function($scope, NoteStore) {


  $scope.notes = NoteStore.list();

  $scope.remove = function(noteId) {
    NoteStore.remove(noteId);
  };

}])

.controller('EditListController', ["$scope", "NoteStore", "$state", "$stateParams", function($scope, NoteStore, $state, $stateParams) {


  var ID = $stateParams.noteId;
  $scope.note = angular.copy(NoteStore.get(ID));

  $scope.save = function() {
    NoteStore.update($scope.note);
    $state.go('app.todolist')
  };


}])

.controller('AddListController', ["$scope", "$state", "NoteStore", function($scope, $state, NoteStore) {
  $scope.note = {
    id: new Date().getTime().toString(),
    title: '',
    description: ''
  };

  $scope.save = function() {
    NoteStore.create($scope.note);
    $state.go('app.todolist')
  };
}])



.controller('ListController', ["$scope", "$http", "$state", "$stateParams", "$localstorage", "$ionicHistory", "Data", function($scope, $http, $state, $stateParams, $localstorage, $ionicHistory, Data) {

  $scope.data = {
    hideImage: true,
    showReorder: false
  }
  var loadedClinicalData;
  var loadedDepartmentData;

  $scope.makeURL = function() {
    console.log('making URL');
    var URLObject = Data.makeURL();
    $scope.clinicalURL = URLObject.clinical;
    $scope.departmentURL = URLObject.department;
    $localstorage.setObject('settings', URLObject);
  }

  $scope.resetDefaultData = function() {
    //blank at the moment to keep everything tidy
  }

  $scope.makeURL();
  loadedClinicalData = Data.getClinicalData();
  console.log('getting data from data service');
  if (loadedClinicalData.clinical) {
    //only add it to the scope if there is a clinical key, otherwise carry on with the same data
    $scope.clinicals = loadedClinicalData.clinical;
  }
  loadedDepartmentData = Data.getDepartmentData();
  if (loadedDepartmentData.department) {
    //same as for clinical
    $scope.department = loadedDepartmentData.department;
  }
  $scope.whichCondition = $stateParams.aId;

  //
  // $http.get($scope.clinicalURL, {
  //     cache: true
  //   })
  //   .success(function(data) {
  //     if (data.clinical) {
  //       $scope.clinicals = data.clinical;
  //     }
  //     //if no clinical key then load default
  //     else {
  //       console.log('no clinical key');
  //       $scope.resetDefaultData('clinical');
  //       $ionicHistory.clearCache().then(function() {
  //
  //         $state.go('app.home', {}, {
  //           reload: true
  //         });
  //       })
  //     }
  //   })
  //   .error(function(data) {
  //     console.log('load failed');
  //     $scope.resetDefaultData('clinical');
  //     $ionicHistory.clearCache().then(function() {
  //
  //       $state.go('app.home', {}, {
  //         reload: true
  //       });
  //     })
  //   });
  //
  // $http.get($scope.departmentURL, {
  //     cache: true
  //   })
  //   .success(function(data) {
  //     if (data.department) {
  //       $scope.department = data.department;
  //     }
  //     //if no department key then load default
  //     else {
  //       $scope.resetDefaultData('department');
  //       $ionicHistory.clearCache().then(function() {
  //
  //         $state.go('app.home', {}, {
  //           reload: true
  //         });
  //       })
  //     }
  //   })
  //   .error(function(data) {
  //     console.log('dept load failed');
  //     $scope.resetDefaultData('department');
  //     $ionicHistory.clearCache().then(function() {
  //
  //       $state.go('app.home', {}, {
  //         reload: true
  //       });
  //     })
  //   });

}])

.controller('SettingsController', ["$scope", "NoteStore", "$state", "$stateParams", "$localstorage", "$ionicHistory", "Data", "$ionicLoading", "$ionicHistory",
  function($scope, NoteStore, $state, $stateParams, $localstorage, $ionicHistory, Data, $ionicLoading, $ionicHistory) {
    var newData;
    var state;
    $scope.success = "";

    $scope.$on('$ionicView.enter', function() {
      $scope.buttonColour = $scope.clinicalButtonColour = $scope.departmentButtonColour = "button-positive";
      $scope.rootText = "Set root web address";
      $scope.departmentButtonText = "Load Department Data";
      $scope.clinicalButtonText = "Load Clinical Data";
      $scope.httpLabel = "http://www.";
      newData = Data.getSettings();
      if (newData) {
        $scope.root = newData.root;
        $scope.specialty = newData.specialty;
        if (newData.root && newData.root.indexOf('www') > -1) {
          $scope.httpLabel = ""; //hide httpLabel when the root is created with www at the start
        }
      }

    });

    //loading data

    $scope.showContent = function($fileContent){
    var data = JSON.parse($fileContent);
    if(data)
    {
      console.log('found data');
      if (data.department){
          console.log('valid JSON');
          state = 'department';
          Data.saveDepartmentData(data);
          $scope.success = "Loaded department data - press HOME"
        }
        else if(data.clinical){
          console.log('valid JSON');
          state = 'clinical'; 
          Data.saveClinicalData(data);
          $scope.success ="Loaded clinical data - press HOME";
    
        }
        else{
          return;
        }
    
          $state.go($state.current, {}, {
            reload: true
          });
    
        
      }
    else{
      console.log('no key');
      $scope.success = "Failed- file "+state+suffix +" not found";
    }
    // $scope.content = $fileContent;
    };


    $scope.setRoot = function(root, specialty) {
      console.log("setRoot function");
      if (!root || !specialty) {
        console.log('error');
        return false;
      }
      if (root.indexOf('www') == -1) {
        //ensure root isn't empty and doesnt' start with www -so want to add www to it
        console.log("setting root with www");
        root = "http://www." + root;
        $scope.httpLabel = "";
      }
      newData.root = root;
      newData.specialty = specialty;
      newData.clinical = root + "/" + specialty + "/docs" + "/clinical.json";
      newData.department = root + "/" + specialty + "/docs" + "/department.json";
      Data.storeSettings(newData);
      $scope.buttonColour = "button-balanced";
      $scope.rootText = "ROOT SET!";
      $scope.departmentButtonText = "Load Department Data";
      $scope.departmentButtonColour = 'button-positive';
      $scope.clinicalButtonColour = 'button-positive';
      $scope.clinicalButtonText = "Load Clinical Data";
      $scope.rootSet = true;

      return true;
    }

    $scope.loadDepartmentData = function() {
      // console.log('not yet implemented loadDepartmentData');
      $ionicLoading.show({
        template: 'Loading Department Data'
      });
      departmentURL = Data.getDepartmentSettings();
      Data.loadDepartmentData(departmentURL).then(function(data) {
        if (data.department) {
          $scope.departmentButtonText = "Department Data LOADED";
          $scope.departmentButtonColour = "button-balanced";
        }


        if (data == false) {
          console.log("error");
          $scope.departmentButtonText = "Department Data FAILED";
          $scope.departmentButtonColour = "button-assertive";
        }
        $ionicLoading.hide();
      });
    };

    $scope.loadClinicalData = function() {
      console.log('not yet implemented loadClinicalData');
      $ionicLoading.show({
        template: 'Loading Clinical Data'
      });
      clinicalURL = Data.getClinicalSettings();
      Data.loadClinicalData(clinicalURL).then(function(data) {
        if (data.clinical) {
          $scope.clinicalButtonText = "Clinical Data LOADED";
          $scope.clinicalButtonColour = "button-balanced";
        }
        if (data == false) {
          console.log('error');
          $scope.clinicalButtonText = "Department Data FAILED";
          $scope.clinicalButtonColour = "button-assertive";
        }
        $ionicLoading.hide();
      });
    }

    $scope.goHome = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearCache().then(
        function() {
          $state.go('app.home');
        }
      )

    }


  }
])

//https://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs/
.directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);

      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();

        reader.onload = function(onLoadEvent) {
          // console.log('onload');
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});
