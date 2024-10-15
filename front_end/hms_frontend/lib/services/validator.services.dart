class ValidatorService {

  static const List<String> validTitles = [
    "Mr.",
    "Ms.",
    "Mrs.",
    "Dr.",
    "Prof.",
    "Eng.",
    "PhD",
    "MBA",
  ];

  static dynamic validateTitle(String title) {
    if (title.isEmpty) {
      return "Title cannot be empty";
    }
    
    if (!validTitles.contains(title)) {
      return "Please enter a valid title";
    }

    return true; 
  }
  
  static dynamic validateEmail(String email) {
    if(email.isEmpty){
      return "Email cannot be empty.";
    }
        final bool emailMatch = RegExp(
        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
        .hasMatch(email);
    
      if(!emailMatch){
        return "Please enter a valid email adress";
      }
    return true;
  }

  static dynamic validatePasword(String password, String confirmPassword){
     if (password.isEmpty) {
      return "Password field is empty";
     }
    if (password.length > 30 || password.length < 8 ){
      return "Password should be between 8 and 30 characters long";
    }
    if(password!=confirmPassword){
      return "Passwords do not match!";
    }
    return true;
  }

  static dynamic validateNames(String name, String surname){
    if (name.isEmpty){
      return "Please provide a name";
    }
    if(surname.isEmpty){
      return "Please provide a surname";
    }
    return true;
  }
}