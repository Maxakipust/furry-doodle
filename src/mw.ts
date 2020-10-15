import fs from 'fs';
import managerData from '../src/managers.json';
import applicantData from '../src/applicants.json';


class Manager {
    name:String;
    prefrences:Array<Applicant> = [];
    partner: (Applicant | null) = null;
    prefStr:Array<String>;

    constructor(name:String, prefStr:Array<String>){
        this.name = name;
        this.prefStr = prefStr;
    }

    init(){
        this.prefStr.forEach((pref)=>{
            let prefObj: (Applicant | undefined) = allApplicants.find((a)=>a.name.toLowerCase() === pref.toLowerCase());
            if(!prefObj){
                throw Error(`${pref} not found in Applicants`);
            }
            this.prefrences.push(prefObj);
        })
    }
}

class Applicant {
    name:String;
    prefrences:Array<Manager> = [];
    partner: (Manager | null) = null;
    prefStr:Array<String>

    constructor(name:String, prefStr:Array<String>){
        this.name = name;
        this.prefStr = prefStr;
    }

    init(){
        this.prefStr.forEach((pref)=>{
            let prefObj: (Manager | undefined) = allManagers.find((a)=>a.name.toLowerCase() === pref.toLowerCase());
            if(!prefObj){
                throw Error(`${pref} not found in Managers`);
            }
            this.prefrences.push(prefObj);
        })
    }
}



var allManagers: Array<Manager> = [];

var allApplicants: Array<Applicant> = [];

(Object.keys(managerData) as Array<keyof typeof managerData>).forEach((current) => {
    allManagers.push(new Manager(current, managerData[current].prefrences));
});
(Object.keys(applicantData) as Array<keyof typeof applicantData>).forEach((current) => {
    allApplicants.push(new Applicant(current, applicantData[current].prefrences));
});

allManagers.forEach((manager)=>manager.init());
allApplicants.forEach((applicant)=>applicant.init());

//returns true if a prefers m1 over m2
function prefrence(a:Applicant, m1:Manager, m2:Manager){
    if(a.prefrences.indexOf(m1) === -1){
        return false;
    }
    if(a.prefrences.indexOf(m2) === -1){
        return true;
    }
    return a.prefrences.indexOf(m1) < a.prefrences.indexOf(m2);
}

function removeByValue(arr:Array<any>, ele:any){
    return arr.splice(arr.indexOf(ele), 1);
}

function print(){
    console.log('----START----');
    console.log(`Managers:`);
    allManagers.forEach((manager)=>console.log(`${manager.name} : ${manager.partner ? manager.partner.name : 'null'}`));
    console.log('\nApplicants');
    allApplicants.forEach((applicant)=>console.log(`${applicant.name} : ${applicant.partner ? applicant.partner.name : 'null'}`));
    console.log('----END----');
}

let freeManagers: Array<Manager> = allManagers.map((man)=>man, []);
let managerIndex = 0;
let madeChange = false;
while(freeManagers.length > 0){
    print();
    let manager:Manager = freeManagers[managerIndex];
    manager.prefrences.some((prefrenceA)=>{
        console.log(`matching ${manager.name} and ${prefrenceA.name}`);
        if(prefrenceA.partner === null){
            console.log(`${prefrenceA.name} does not have a partener already`);
            if(prefrenceA.prefrences.indexOf(manager)!=-1){
                console.log(`${prefrenceA.name} is ok with ${manager.name}. Matching with ${manager.name}`)
                manager.partner = prefrenceA;
                prefrenceA.partner = manager;
                removeByValue(freeManagers, manager);
                madeChange = true;
                return true;
            }else{
                console.log(`${prefrenceA.name} is not ok with ${manager.name}`);
            }
        }else{
            let prefCurPartnerM: Manager = prefrenceA.partner;
            console.log(`${prefrenceA.name} is already partenered with ${prefCurPartnerM.name}`);
            if(prefrence(prefrenceA, manager, prefCurPartnerM)){
                console.log(`${prefrenceA.name} prefers ${manager.name} over ${prefCurPartnerM.name}. Matching with ${manager.name}`);
                prefrenceA.partner = manager;
                manager.partner = prefrenceA;
                removeByValue(freeManagers, manager);

                prefCurPartnerM.partner = null;
                freeManagers.push(prefCurPartnerM);
                madeChange = true;
                return true;
            }else{
                console.log(`${prefrenceA.name} prefers ${prefCurPartnerM.name} over ${manager.name}. Not doing anything`);
            }
        }
        return false;
    })
    managerIndex++;
    if(managerIndex>=freeManagers.length){
        managerIndex = 0;
        if(!madeChange){
            break;
        }
        madeChange = false;
    }
}
console.log("Final Result");
print();