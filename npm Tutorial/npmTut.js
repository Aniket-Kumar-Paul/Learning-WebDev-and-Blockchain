//In terminal :-
//npm init
//npm install <package name> //adds the package to dependencies
//npm install <package name> --save-dev //adds the package to developer dependencies
//npm install <package name> --global //installs the package globally

//If accidentally deleted node_modules folder, simply use: npm install

//To install a specific version : npm install <package name>@<version>
//Eg: npm install express@1.3.5
//NOTE : 1.3.5 -> <major>.<minor>.<patch>

//In package.json's dependencies, 
// ^ => install exact version
// ~ => install latest patch
// > => install latest package