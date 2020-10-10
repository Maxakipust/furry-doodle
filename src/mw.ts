import fs from 'fs';
import managerData from '../src/managers.json';
import applicantData from '../src/applicants.json';


class Manager {
    name:String;
    prefrences:Array<Applicant> = [];
    partners: Array<Applicant> = [];
    prefStr:Array<String>;
    maxParteners: number;

    constructor(name:String, prefStr:Array<String>, maxPartners: number){
        this.name = name;
        this.prefStr = prefStr;
        this.maxParteners = maxPartners;
    }

    init(){
        this.prefrences = this.prefStr.map((applicantStr)=>allApplicants.find((a)=>a.name === applicantStr)!);
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
        this.prefrences = this.prefStr.map((managerStr)=>allManagers.find((m)=>m.name === managerStr)!);
    }
}



var allManagers: Array<Manager> = [];

var allApplicants: Array<Applicant> = [];

(Object.keys(managerData) as Array<keyof typeof managerData>).forEach((current) => {
    allManagers.push(new Manager(current, managerData[current].prefrences, managerData[current].maxParteners));
});
(Object.keys(applicantData) as Array<keyof typeof applicantData>).forEach((current) => {
    allApplicants.push(new Applicant(current, applicantData[current].prefrences));
});

allManagers.forEach((manager)=>manager.init());
allApplicants.forEach((applicant)=>applicant.init());

//returns true if a prefers m1 over m2
function prefrence(a:Applicant, m1:Manager, m2:Manager){
    return a.prefrences.indexOf(m1) > a.prefrences.indexOf(m2);
}

function removeByValue(arr:Array<any>, ele:any){
    return arr.splice(arr.indexOf(ele), 1);
}

function print(){
    console.log(`Managers:`);
    allManagers.forEach((manager)=>console.log(`${manager.name} : ${manager.partners.length===0 ? 'null' : manager.partners.map((a)=>a.name).join(', ')} ${freeManagers.indexOf(manager)===-1?' ':'*'}`));
    console.log('\nApplicants');
    allApplicants.forEach((applicant)=>console.log(`${applicant.name} : ${applicant.partner ? applicant.partner.name : 'null'}`));
    console.log('\n');
}

let freeManagers: Array<Manager> = allManagers.map((man)=>man, []);
let managerIndex: number = 0;
let applicantIndex: number = 0;
let maxApplicantIndex: number = Math.max(...allManagers.map((man)=>man.prefrences.length, []))+1;
let madeChange:boolean = false;
while(freeManagers.length > 0){
    print();
    let currentManager:Manager = freeManagers[managerIndex];
    if(currentManager){
        let prefrenceA: Applicant = currentManager.prefrences[applicantIndex];
        if(prefrenceA){
            console.log(`Trying to match ${currentManager.name} with ${prefrenceA.name}`);
            if(prefrenceA.partner === null){
                console.log(`${prefrenceA.name} doesen't have a match yet`)
                if(prefrenceA.prefrences.indexOf(currentManager) != -1){
                    console.log(`${prefrenceA.name} is ok with ${currentManager.name}`)
                    prefrenceA.partner = currentManager;
                    currentManager.partners.push(prefrenceA);
                    if(currentManager.partners.length >= currentManager.maxParteners){
                        console.log(`${currentManager.name} is full`);
                        removeByValue(freeManagers, currentManager);
                    }
                    madeChange = true;
                }
            }else{
                console.log(`${prefrenceA.name} is already matched with ${prefrenceA.partner.name}`);
                let currentPrefM:Manager = prefrenceA.partner;
                if(prefrence(prefrenceA, currentManager, currentPrefM)){
                    console.log(`${prefrenceA.name} prefers ${currentManager.name} over ${currentPrefM.name}`);
                    if(prefrenceA.prefrences.indexOf(currentManager) != -1){
                        console.log(`${prefrenceA.name} is ok with ${currentManager}`)
                        removeByValue(currentPrefM.partners, prefrenceA);
                        if(currentPrefM.partners.length < currentPrefM.maxParteners && freeManagers.indexOf(currentPrefM)===-1){
                            console.log(`${currentPrefM.name} is no longer full`)
                            freeManagers.push(currentPrefM);
                        }
                        prefrenceA.partner = currentManager;
                        currentManager.partners.push(prefrenceA);
                        if(currentManager.partners.length >= currentManager.maxParteners){
                            removeByValue(freeManagers, currentManager);
                        }
                        madeChange = true;
                    }
                }
            }
        }
    }
    managerIndex++;
    if(managerIndex >= freeManagers.length){
        managerIndex = 0;

        applicantIndex++;
        if(applicantIndex >= maxApplicantIndex){
            applicantIndex = 0;

            if(!madeChange){
                break
            }
            madeChange = false
        }
    }
}

print();