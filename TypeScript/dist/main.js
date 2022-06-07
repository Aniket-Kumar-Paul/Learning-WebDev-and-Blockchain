var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// VARIABLES - var, const, let
var hello = "world";
hello = "foo";
// hello = 3; -> not allowed #we can change value only to same data type (here string)
var a = "hi"; // you can specify types explicitly(recommended)
// FUNCTIONS
var getFullName = function (name, surname) {
    return name + ' ' + surname;
};
console.log(getFullName("Aniket", "Paul"));
// CREATING OBJECTS
// we can specify entity definition in typescript
var user1 = {
    name: "Monster",
    age: 30
};
var popularTags = ['dragon', 'coffee'];
var user2 = {
    id: "8",
    name: "Aniket",
    age: 30,
    getMessage: function () {
        return "Hello" + name;
    }
};
console.log(user2.getMessage());
// UNION operator - to combine datatypes
var errorMessage = null; // errorMessage can be of type string, number or null
var user3 = null;
// VOID - In a function,, when we don't return anything it's void
var doSomething = function () {
    console.log("doSomething");
};
// Other data types - any, never, unknown
// Type Assertion ('as' keyword)
var vAny = 10;
var vUnknown = 10;
var s1 = vAny;
// let s2: string = vUnknown; -> will give error 
var s2 = vUnknown; // type assertion
var pageNum = "1";
var numericPage = pageNum; // first convert to unknown then to required type
// Working with DOM
// const someElement = document.querySelector(".foo"); -> it returns an element, but we can't directly get it's value if it is an input element for eg.
var someElement1 = document.querySelector(".foo");
console.log(someElement1.value);
var someElement2 = document.querySelector(".hoo");
someElement2.addEventListener('blur', function (event) {
    var target = event.target;
    console.log('event', target.value);
});
var User = /** @class */ (function () {
    function User(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.unchangableName = firstName;
    }
    User.prototype.changeUnchangableNmae = function () {
        // this.unchangableName = "foo"; will give error as readonly (like constant)
    };
    User.prototype.getFullname = function () {
        return this.firstName + ' ' + this.lastName;
    };
    User.maxAge = 50; // static properties are accessible only to classes & not its instances
    return User;
}());
var Admin = /** @class */ (function (_super) {
    __extends(Admin, _super);
    function Admin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Admin;
}(User));
var user = new Admin('Aniket', 'Paul');
console.log(user.getFullname());
// GENERICS in TS
// If we don't provide argument type - it will be any [and we should avoid 'any']
// 'T' is default name for generic
// All generic data types are written inside <>
var addId = function (obj) {
    var id = Math.random.toString().substring(0, 16);
    return __assign(__assign({}, obj), { id: id });
};
var newUser = {
    name: "Jack"
};
var result = addId(newUser); // addId(newUser) also works
// const result = addId<string>("foo"); -> will work if only 'T' was written instead of 'T extends object'
console.log(result); // -> {name: "Jack", id: "0.cdf4294a66e"}
var userX = {
    name: "Aniket",
    data: {
        meta: "foo"
    },
    meta: "bar"
};
var userY = {
    name: "Ayush",
    data: ["foo", "bar", "bazar"],
    meta: 3
};
// ENUMS - enum objects can be used as a datatype
var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["NotStarted"] = 0] = "NotStarted";
    StatusEnum[StatusEnum["InProgress"] = 1] = "InProgress";
    StatusEnum[StatusEnum["Done"] = 2] = "Done";
})(StatusEnum || (StatusEnum = {}));
console.log(StatusEnum.NotStarted); // 0
var notStartedStatus = StatusEnum.NotStarted; // 1
// notStartedStatus = "hi" // error
notStartedStatus = StatusEnum.Done;
// Recommended to use enums for constants
