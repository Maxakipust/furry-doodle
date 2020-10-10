// class Applicant {
//     public name: string;
//     rankingStr: Array<String>
//     public rankings: Array<Program> = [];
//     public match: (Program | null) = null;
//     constructor(name: string, ranking: Array<String>){
//         this.name = name;
//         this.rankingStr = ranking;
//     }

//     init(){
//         this.rankings = this.rankingStr.map((programName)=>programs.find((program)=>program.name === programName)!,[]);
//     }
// }

// class Program {
//     public name: string;
//     rankingStr: Array<String>;
//     public rankings: Array<Applicant> = []
//     public maxPositions: number;
//     public matches: Array<Applicant> = [];
//     constructor(name: string, ranking: Array<String>, maxPositions: number){
//         this.name = name;
//         this.rankingStr = ranking;
//         this.maxPositions = maxPositions;
//     }

//     init(){
//         this.rankings = this.rankingStr.map((applicantName)=>applicants.find((applicant)=>applicant.name === applicantName)!,[]);
//     }
// }

// let applicants: Array<Applicant> = [
//     new Applicant("Aurthur", ["City"]),
//     new Applicant("Sunny", ["City", "Mercy"]),
//     new Applicant("Joseph", ["City", "General", "Mercy"]),
//     new Applicant("Latha", ["Mercy", "City", "General"]),
//     new Applicant("Darrius", ["City", "Mercy", "General"])
// ]

// let programs: Array<Program> = [
//     new Program("Mercy", ["Darrius", "Joseph"], 2),
//     new Program("City", ["Darrius", "Aurthur", "Sunny", "Latha", "Joseph"], 2),
//     new Program("General", ["Darrius", "Aurthur", "Joseph", "Latha"], 2)
// ]

// applicants.forEach((applicant)=>applicant.init());
// programs.forEach((porgram)=>porgram.init());

// function removeValue(array:Array<any>, value:any){
//     while(array.indexOf(value)!=-1){
//         array.splice(array.indexOf(value), 1);
//     }
// }

// function printState(){
//     console.log("Applicants");
//     applicants.forEach((applicant: Applicant)=>{
//         console.log(`${applicant.name} : ${applicant.match?applicant.match.name:'null'}`);
//     })
//     console.log('');
//     console.log("Programs");
//     programs.forEach((program:Program)=>{
//         console.log(`${program.name} : ${program.matches.map((applicant)=>applicant.name).join(',')}`);
//     })
//     console.log('');
// }

// function trimProgram(program:Program){
//     let include:Array<Applicant> = program.matches.sort((a:Applicant, b:Applicant)=>program.rankings.indexOf(a) - program.rankings.indexOf(b));
//     include.splice(program.maxPositions);
//     program.matches.forEach((match)=>{
//         if(include.indexOf(match) === -1){
//             match.match = null;
//         }
//     })
//     program.matches = include;
// }

// let programIndex: number = 0;
// let hasUpdated = false;
// while(true){
//     printState();
//     let freeProgram = programs[programIndex];
//     freeProgram?.rankings.some((applicant:Applicant)=>{
//         if(applicant.rankings.indexOf(freeProgram) != -1){
//             if(!applicant.match){
//                 applicant.match = freeProgram;
//                 freeProgram.matches.push(applicant);
//                 trimProgram(freeProgram);
//                 hasUpdated = true;
//                 return true;
//             }else{
//                 if(applicant.rankings.indexOf(applicant.match)>applicant.rankings.indexOf(freeProgram)){
//                     removeValue(applicant.match.matches, applicant);
//                     applicant.match = freeProgram;
//                     freeProgram.matches.push(applicant);
//                     trimProgram(freeProgram);
//                     hasUpdated = true;
//                     return true;
//                 }
//             }
//         }
//         return false;
//     });
//     programIndex ++;
//     if(programIndex > programs.length){
//         programIndex = 0;
//         if(!hasUpdated){
//             break;
//         }
//         hasUpdated = false;
//     }
// }
// printState();