
const dateformat = (date) => {
    try {

        const formatdate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(date));
        const dateformats = formatdate.toString().replace(new RegExp(",", "g"), "")
        return dateformats;
    } catch (error) {
        console.log(error)
    }
}
const datenow = () => {
    try {
        const date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());
        const datetime = date.toString().replace(new RegExp(",", "g"), "");
        return datetime;
    } catch (error) {
        // console.log(error)
    }
}

const dateexport = () => {
    try {
        const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", hour12: false }).format(new Date());
        const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());
        return date + " " + time;

    } catch (error) {
        console.log(error)
    }
}

const datenowreplace = () => {
    try {
        const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        const datenowreplace = date.toString().replace(new RegExp("-", "g"), "");
        return datenowreplace;
    } catch (error) {
        console.log(error);
    }
}

const datevaluereplace = (date) => {
    try {
        const dates = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
        const datenowreplace = dates.toString().replace(new RegExp("-", "g"), "");
        return datenowreplace;
    } catch (error) {
        console.log(error);
    }
}

const datetimeformat = (date) => {
    try {
        // console.log(date)

        const dateformat = new Intl.DateTimeFormat("en-gb", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(date));
        const timeformat = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false , timeZone : "Asia/Bangkok" }).format(new Date(date));
      
        const datetime = dateformat + " " + timeformat;
        return datetime;

    } catch (error) {
        console.log(error);
    }

}

const adddatemonth = (date) => {
    try {

    } catch (error) {
        console.log(error)
    }

}




module.exports = { dateformat, datenow, dateexport, datenowreplace, datevaluereplace , datetimeformat }