import * as Http from "http";
import * as Url from "url";

namespace Server {

    interface AssocStringString {
        [key: string]: string;
    }

    interface Studi {
        name: string;
        firstname: string;
        matrikel: number;
        age: number;
        gender: boolean;
        course: string;
    }

    // homogen assoziativ: Datensatz wird Matrikelnummer zugeordnet
    interface Studis {
        [matrikel: string]: Studi;
    }
    
    
    // Homogen assoziativ: Speicherung unter Matrikelnummer
    let studiHomoAssoc: Studis = {};
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8200;

    let server: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        
        _response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');//Options: Um abzufragen, ob man auf den Server zugreifen kann
        _response.setHeader('Access-Control-Allow-Headers', '*');//GET: Um Antwort zurück zu bekommen
    });
    server.addListener("speichern", handleRequest);
    server.listen(port);

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Ich höre Stimmen!");
        let query: AssocStringString = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"] ) {
            switch (query["command"] ) {
                case "insert": 
                    insert(query, _response);
                    break;
                 
                case "refresh":
                    refresh(_response);
                    break;
                    
                case "suchen":
                    search(query, _response);
                    break;
               
                default: 
                    error();
            } 
        }
        _response.end();    
        
    }      
        
        function insert(query: AssocStringString, _response: Http.ServerResponse): void {
            let obj: Studi = JSON.parse(query["data"]);
            let _name: string = obj.name;
            let _firstname: string = obj.firstname;  
            let matrikel: string = obj.matrikel.toString(); 
            let _age: number = obj.age;
            let _gender: boolean = obj.gender;
            let course: string = obj.course;  
            let studi: Studi;
            studi = {
                name: _name,
                firstname: _firstname,
                matrikel: parseInt(matrikel),
                age: _age,
                gender: _gender,
                course: course
            };  
            studiHomoAssoc[matrikel] = studi;
            _response.write("Daten empfangen");
            }

        function refresh(_response: Http.ServerResponse): void {
            console.log(studiHomoAssoc);
            for (let matrikel in studiHomoAssoc) {  
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.course + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)"; 
            _response.write(line + "\n");                                          
            }
        } 
        
        function search(query: AssocStringString, _response: Http.ServerResponse): void {
            let studi: Studi = studiHomoAssoc[query["searchFor"]];
            if (studi) {
                let line: string = query["searchFor"] + ": ";
                line += studi.course + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
                line += studi.gender ? "(M)" : "(F)";
                _response.write(line);
            } else {
                _response.write("No Match");    
            }    
        }
        
        function error(): void {
            alert("Error"); 
        }

        
    
}