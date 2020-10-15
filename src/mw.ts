import fs from 'fs';
import managerData from '../src/managers.json';
import applicantData from '../src/applicants.json';

//a class to hold all the data for a manager
class Manager {
    name:String;
    preferences:Array<Applicant> = [];
    partner: (Applicant | null) = null;
    prefStr:Array<String>;

    //creates a new manager with a given name and names of preferences
    constructor(name:String, prefStr:Array<String>){
        this.name = name;
        this.prefStr = prefStr;
    }

    //maps the names of preferences to actual objects
    init(){
        this.prefStr.forEach((pref)=>{
            let prefObj: (Applicant | undefined) = allApplicants.find((a)=>a.name.toLowerCase() === pref.toLowerCase());
            if(!prefObj){
                throw Error(`${pref} not found in Applicants`);
            }
            this.preferences.push(prefObj);
        })
    }
}

//a class to hold all the data for a applicant
class Applicant {
    name:String;
    preferences:Array<Manager> = [];
    partner: (Manager | null) = null;
    prefStr:Array<String>

    //creates a new applicant with a given name and names of preferences
    constructor(name:String, prefStr:Array<String>){
        this.name = name;
        this.prefStr = prefStr;
    }

    //maps the names of preferences to actual objects
    init(){
        this.prefStr.forEach((pref)=>{
            let prefObj: (Manager | undefined) = allManagers.find((a)=>a.name.toLowerCase() === pref.toLowerCase());
            if(!prefObj){
                throw Error(`${pref} not found in Managers`);
            }
            this.preferences.push(prefObj);
        })
    }
}



var allManagers: Array<Manager> = [];

var allApplicants: Array<Applicant> = [];

//load all the manager and applicant data from the data files
(Object.keys(managerData) as Array<keyof typeof managerData>).forEach((current) => {
    allManagers.push(new Manager(current, managerData[current].preferences));
});
(Object.keys(applicantData) as Array<keyof typeof applicantData>).forEach((current) => {
    allApplicants.push(new Applicant(current, applicantData[current].preferences));
});

//initialize all the managers and applicants
allManagers.forEach((manager)=>manager.init());
allApplicants.forEach((applicant)=>applicant.init());

//returns true if a prefers m1 over m2
function preference(a:Applicant, m1:Manager, m2:Manager){
    if(a.preferences.indexOf(m1) === -1){
        return false;
    }
    if(a.preferences.indexOf(m2) === -1){
        return true;
    }
    return a.preferences.indexOf(m1) < a.preferences.indexOf(m2);
}

//removes a value from an array
function removeByValue(arr:Array<any>, ele:any){
    return arr.splice(arr.indexOf(ele), 1);
}

//prints out all of the managers and applicants and who they are partnered with
function print(){
    console.log('----START----');
    console.log(`Managers:`);
    allManagers.forEach((manager)=>console.log(`${manager.name} : ${manager.partner ? manager.partner.name : 'null'}`));
    console.log('\nApplicants');
    allApplicants.forEach((applicant)=>console.log(`${applicant.name} : ${applicant.partner ? applicant.partner.name : 'null'}`));
    console.log('----END----');
}

//an array that contain all the managers that don't already have a partner
let freeManagers: Array<Manager> = allManagers.map((man)=>man, []);
//the index of the current manager that we are looking at
let managerIndex = 0;
//if we have made a change this round of going through the managers
let madeChange = false;
//while we have a free manager to assign someone to
while(freeManagers.length > 0){
    print();
    //grab the current free manager
    let manager:Manager = freeManagers[managerIndex];
    //go through their preferences
    manager.preferences.some((preferenceA)=>{
        console.log(`matching ${manager.name} and ${preferenceA.name}`);
        //if they don't have a partner
        if(preferenceA.partner === null){
            console.log(`${preferenceA.name} does not have a partner already`);
            // and if they are ok with the current manager
            if(preferenceA.preferences.indexOf(manager)!=-1){
                //match them
                console.log(`${preferenceA.name} is ok with ${manager.name}. Matching with ${manager.name}`)
                manager.partner = preferenceA;
                preferenceA.partner = manager;
                //the current manager is no longer free
                removeByValue(freeManagers, manager);
                //record that we made a change and stop going through the rest of the managers preferences
                madeChange = true;
                return true;
            }else{
                console.log(`${preferenceA.name} is not ok with ${manager.name}`);
            }
        }else{
            //if they already have a partner
            let prefCurPartnerM: Manager = preferenceA.partner;
            console.log(`${preferenceA.name} is already partnered with ${prefCurPartnerM.name}`);
            //if they prefer the current manager over their current match
            if(preference(preferenceA, manager, prefCurPartnerM)){
                //match them
                console.log(`${preferenceA.name} prefers ${manager.name} over ${prefCurPartnerM.name}. Matching with ${manager.name}`);
                preferenceA.partner = manager;
                manager.partner = preferenceA;
                //current manager is no longer free
                removeByValue(freeManagers, manager);

                //free up the old manager
                prefCurPartnerM.partner = null;
                freeManagers.push(prefCurPartnerM);
                //record that we made a change and stop going through the rest of the managers preferences
                madeChange = true;
                return true;
            }else{
                console.log(`${preferenceA.name} prefers ${prefCurPartnerM.name} over ${manager.name}. Not doing anything`);
            }
        }
        return false;
    })
    //move onto the next manager
    managerIndex++;
    if(managerIndex>=freeManagers.length){
        managerIndex = 0;
        //if we have gone through every manager without making a change, there is nothing left that we can do
        if(!madeChange){
            break;
        }
        madeChange = false;
    }
}
console.log("Final Result");
print();