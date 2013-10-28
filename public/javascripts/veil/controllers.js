/**
 * Created with JetBrains WebStorm.
 * User: Jason
 * Date: 7/9/13
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module('veilApp.controllers', ['ngProgress', 'recordWrapper'])
    //Panel Controllers
    .controller('homeCtrl', function ($scope, $location, dropstoreClient, ngProgress) {
        $scope.dropboxLogin = function(){

            dropstoreClient.create({key: '7ytnloi7tlrkmdg'})
                .authenticate({interactive: true})
                .then(function(datastoreManager){
                    //ngProgress.complete();
                    console.log('completed authentication');
                        $location.path('/list');
                    //return datastoreManager.openDefaultDatastore();
                })
        }

    })
    .controller('listCtrl', function ($scope, $location, dropstoreClient, ngProgress, recordWrapper) {
        $scope.recordWrapper = recordWrapper;
        ngProgress.color('#c64537');
        ngProgress.start();
        $scope.masterKeys = [];
        $scope.encryptedKeys = [];
        var datastoreManager = dropstoreClient.getDatastoreManager()
        datastoreManager.openDefaultDatastore().then(function(datastore){
                    console.log('completed openDefaultDatastore');
                    _datastore = datastore;

                    //start listening to updates to the tasks table.
                    ngProgress.complete()
                    _datastore.SubscribeRecordsChanged(function(records){

                        for(var ndx in records){
                            var record = records[ndx];

                            if(record.isDeleted()){
                                for(var s_ndx in $scope.encryptedKeys){
                                    var curr_record = $scope.encryptedKeys[s_ndx];
                                    if(curr_record.getId() == record.getId()){
                                        $scope.encryptedKeys.splice($scope.encryptedKeys.indexOf(curr_record), 1);
                                        //deleted task
                                        break;
                                    }
                                }
                            }
                            else{
                                console.log(record.get('keyName'));
                                var found= false;
                                //task is new or updated.
                                for(var s_ndx in $scope.encryptedKeys){
                                    var curr_record = $scope.encryptedKeys[s_ndx];
                                    if(curr_record.getId() == record.getId()){
                                        $scope.encryptedKeys[$scope.encryptedKeys.indexOf(curr_record)] = record;
                                        found = true;
                                        //udpate task
                                        break;
                                    }
                                }
                                if(!found){
                                    $scope.encryptedKeys.push(records[ndx]);
                                }
                            }


                        }
                    },'encryptedKeys');

                    var encryptedKeysTable = datastore.getTable('encryptedKeys');
                    $scope.encryptedKeys =  encryptedKeysTable.query();

                    var masterKeysTable = datastore.getTable('masterKeys');
                    $scope.masterKeys =  masterKeysTable.query();
                    console.log('masterkeys', $scope.masterKeys);
                });


        $scope.$on('$destroy', function controllerDismissed() {
            datastoreManager.close();
        });
    })
    .controller('masterKeyCtrl', function ($scope, $location, dropstoreClient, ngProgress) {
        $scope.loadKey = false;
        $scope.currentPrivatePemCert = ""; //Contains the loaded or created Certificate that the user MUST download.
        $scope.currentPublicPemCert = "";
        $scope.currentPassphrase = "";      //This will Never be stored, for this is only for display purposes.

        //Load Existing Master Key Related Methods.
        $scope.loadMasterKeyPassphrase = "";
        $scope.clickBeginLoadMaster = function(){
            $scope.loadKey = true;
            $scope.loadMasterKeyPassphrase = "";
        }

        //Create New Master Key Related Methods.
        $scope.createMasterKeyPassphrase = "";
        $scope.clickBeginCreateMaster = function(){
            $scope.loadKey = false;
            $scope.createMasterKeyPassphrase = "";
        }

        $scope.submitCreateMaster = function(){

            ngProgress.start();
            console.log("submit create master pressed.")
            var rsa = forge.pki.rsa;

            // generate an RSA key pair asynchronously (uses web workers if available)
            rsa.generateKeyPair({bits: 2048, e: 0x10001, workers: 2, workerScript:"/javascripts/forge/prime.worker.js"}, function(err, keypair) {
                // keypair.privateKey, keypair.publicKey
                ngProgress.complete();

                // sign data with a private key and output DigestInfo DER-encoded bytes
                var md = forge.md.sha1.create();
                md.update('sign this', 'utf8');
                var signature = keypair.privateKey.sign(md);
                console.log('signature',signature)
                // verify data with a public key
                var verified = keypair.publicKey.verify(md.digest().bytes(), signature);

                if(verified){
                    //Generate the Certificates.
                    // convert a Forge private key to PEM-format
                    var privatepem = forge.pki.privateKeyToPem(keypair.privateKey);
                    var publicpem = forge.pki.publicKeyToPem(keypair.publicKey);

                    $scope.currentPrivatePemCert = privatepem;
                    $scope.currentPublicPemCert = publicpem;
                    console.log(privatepem);
                }
                else{
                    //TODO: throws error here,
                    throw "Could not verify RSA Keys"
                }

            });




        }
        $scope.exportPrivateKey = function(){
            console.log("private key")

            var blob = new Blob([$scope.currentPrivatePemCert], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "master.private.key");
        }
        $scope.exportPublicKey = function(){
            console.log("public key")
            var blob = new Blob([$scope.currentPublicPemCert], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "master.public.pem");
        }


        var datastoreManager = dropstoreClient.getDatastoreManager()
            datastoreManager.openDefaultDatastore().then(function(datastore){

            })

        $scope.$on('$destroy', function controllerDismissed() {
            datastoreManager.close();
        });
    })