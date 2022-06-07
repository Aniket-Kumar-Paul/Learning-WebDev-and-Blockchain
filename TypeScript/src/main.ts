// VARIABLES - var, const, let
let hello = "world";
hello = "foo";
// hello = 3; -> not allowed #we can change value only to same data type (here string)
let a: string = "hi"; // you can specify types explicitly(recommended)


// FUNCTIONS
const getFullName = (name: string, surname: string): string => {
    return name + ' ' + surname;
};
console.log(getFullName("Aniket", "Paul"));


// CREATING OBJECTS
// we can specify entity definition in typescript
const user1: {name: string, age: number} = {
    name: "Monster",
    age: 30
}


// TYPE ALIASES
type ID = string; 
type PopularTag = string;
type maybePopularTag = PopularTag | null; // creating custom type

const popularTags: PopularTag[] = ['dragon', 'coffee']

// **INTERFACE** - special entity inside typescript which help to create objects
// By default, all values inside an interface are mandatory to give
// to make a value optional, use ?
interface UserInterface {
    id: ID; //string
    name: string;
    age?: number;
    getMessage(): string;
}

const user2: UserInterface = {
    id: "8",
    name: "Aniket",
    age: 30,
    getMessage() {
        return "Hello" + name;
    }
}

console.log(user2.getMessage());


// UNION operator - to combine datatypes
let errorMessage: string | number | null = null ; // errorMessage can be of type string, number or null
let user3: UserInterface | null = null;


// VOID - In a function,, when we don't return anything it's void
const doSomething = (): void => {
    console.log("doSomething");
}
// Other data types - any, never, unknown


// Type Assertion ('as' keyword)
let vAny: any = 10;
let vUnknown: unknown = 10;

let s1: string = vAny;
// let s2: string = vUnknown; -> will give error 
let s2: string = vUnknown as string; // type assertion

let pageNum: string = "1";
let numericPage: number = (pageNum as unknown) as number; // first convert to unknown then to required type


// Working with DOM
// const someElement = document.querySelector(".foo"); -> it returns an element, but we can't directly get it's value if it is an input element for eg.
const someElement1 = document.querySelector(".foo") as HTMLInputElement;
console.log(someElement1.value);

const someElement2 = document.querySelector(".hoo");
someElement2.addEventListener('blur', (event) => {
    const target = event.target as HTMLInputElement;
    console.log('event', target.value);
})


// Working with Classes
interface UserInterFace {
    getFullname(): string;
}

class User implements UserInterFace { // getFullname() function must be defined in the class
    // By default everything is public
    private firstName: string;
    protected lastName: string;
    readonly unchangableName: string;
    static readonly maxAge = 50; // static properties are accessible only to classes & not its instances

    constructor(firstName: string, lastName: string){
        this.firstName = firstName;
        this.lastName = lastName;
        this.unchangableName = firstName;
    }

    changeUnchangableNmae(): void {
        // this.unchangableName = "foo"; will give error as readonly (like constant)
    }

    getFullname(): string {
        return this.firstName + ' ' + this.lastName;
    }
}

class Admin extends User { // INHERITANCE ('extends' keyword)

}

const user = new Admin('Aniket', 'Paul');
console.log(user.getFullname());


// GENERICS in TS
// If we don't provide argument type - it will be any [and we should avoid 'any']
// 'T' is default name for generic
// All generic data types are written inside <>
const addId = <T extends object>(obj: T) => {  // T becomes the type that we pass, 'extends object'=> default generic type is an object
    const id = Math.random.toString().substring(0,16);
    return {
        ...obj,
        id
    }
}

interface UserInterFace2 {
    name: string;
}
const newUser: UserInterFace2 = {
    name: "Jack"
}

const result = addId<UserInterFace2>(newUser); // addId(newUser) also works
// const result = addId<string>("foo"); -> will work if only 'T' was written instead of 'T extends object'

console.log(result) // -> {name: "Jack", id: "0.cdf4294a66e"}


// GENERIC Interface
interface UserInterFace3<T, V> {
    name: string,
    data: T,
    meta: V
}
const userX: UserInterFace3<{meta: string}, string> = {  // We must provide generic type if there is no default
    name: "Aniket",
    data: {
        meta: "foo"
    },
    meta: "bar"
}
const userY: UserInterFace3<string[], number> = {
    name: "Ayush",
    data: ["foo", "bar", "bazar"],
    meta: 3
}


// ENUMS - enum objects can be used as a datatype
enum StatusEnum {
    NotStarted, // we can also assign values using = ; NotStarted = "notStarted"
    InProgress,
    Done
}
console.log(StatusEnum.NotStarted) // 0

let notStartedStatus: StatusEnum = StatusEnum.NotStarted // 1
// notStartedStatus = "hi" // error
notStartedStatus = StatusEnum.Done

interface Task {
    id: string
    status: StatusEnum
}

// Recommended to use enums for constants