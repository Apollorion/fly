function main(){
    let urlPath = window.location.pathname.substr(1).split("/");
    console.log(urlPath);

    if(urlPath[0] === "flight") {

        // This file is templated and $logicalFlights is replaced in terraform
        // with a legitimate json string. See cdn.tf.
        const flights = JSON.parse('${logicalFlights}');

        if(urlPath.length < 2) {
            redirect(urlPath, "Incorrect Length", "https://github.com/Apollorion/fly/blob/main/help/logical-flights.md#incorrect-length");
        }

        const flightIdentifier = urlPath[1];
        if (flightIdentifier in flights) {
            let flight = flights[flightIdentifier];

            if(urlPath.length < 3){
                if("default" in flight) {
                    redirect(urlPath, "default flight", flight["default"]);
                } else {
                    redirect(urlPath, "Incorrect Length", "https://github.com/Apollorion/fly/blob/main/help/logical-flights.md#incorrect-length");
                }
            }

            let flightLogicValues = urlPath[2].split("%23-%23");
            let link = flight["logic"];

            let i = 1;
            for (let item of flightLogicValues) {
                link = link.replace(`$$${i}`, item);
                i++;
            }

            redirect(urlPath, `Following Link`, link);

        } else {
            redirect(urlPath, "Logic Not Found", "https://github.com/Apollorion/fly/blob/main/help/logical-flights.md#logic-not-found");
        }
    } else {
        redirect(urlPath, "Not a logical flight", "https://github.com/Apollorion/fly");
    }

}

function redirect(urlPath, message, link){
    console.log(message);
    if(urlPath[urlPath.length - 1] !== "debug"){
        console.log("following link", link);
        window.location.href = link;
    }
}

main();