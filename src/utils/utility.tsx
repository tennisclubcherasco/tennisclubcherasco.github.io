const calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const FormStyle = {borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}

export { calculateAge, FormStyle };