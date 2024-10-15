import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/services/users.services.dart';
import 'package:hms_frontend/services/validator.services.dart';


class SignupScreen extends StatefulWidget {
  SignupScreen({super.key});

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {

  String message = "";
  Color messageColor = Colors.red; 

  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _degreeController = TextEditingController();

  String _signupMessage = ""; 
  bool _isLoading = false;    

  void signUp() async {
    if (validator() == true) {
      setState(() {
        _isLoading = true;
      });
      var success = await UserService().signUp(
        _usernameController.text,
        _passwordController.text,
        "student",
        _nameController.text,
        _surnameController.text,
        "Student: ",
        _degreeController.text
      );
      setState(() {
        _isLoading = false;
        if (success) {
          _signupMessage = "Registration successful";
          _clearFields();
        } else {
          _signupMessage = "Signup failed. Please try again.";
        }
      });
    }
    else{
      setState(() {
        message = validator();
        messageColor = Colors.redAccent;
      });
    }
  }

  void _clearFields() {
    _usernameController.clear();
    _passwordController.clear();
    _confirmPasswordController.clear();
    _nameController.clear();
    _surnameController.clear();
    _degreeController.clear();
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  MyAppBar(titleText: "Signup", backgroundColor: Colors.lightBlue),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                if (_signupMessage.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      _signupMessage,
                      style: TextStyle(
                        fontSize: 16,
                        color: _signupMessage == 'Registration successful'
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),
                  ),

                const Card(
                  elevation: 20,
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: EdgeInsets.all(15.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        SizedBox(height: 8),
                        Text(
                          'HMS Sign Up',
                          style: TextStyle(
                            fontSize: 19,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _usernameController,
                  hintText: 'email address',
                  obscureText: false,
                  isLocked: false,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _passwordController,
                  hintText: 'password',
                  obscureText: true,
                  isLocked: false,                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _confirmPasswordController,
                  hintText: 'verify password',
                  obscureText: true,
                  isLocked: false,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _nameController,
                  hintText: 'Name',
                  obscureText: false,
                  isLocked: false,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _surnameController,
                  hintText: 'Surname',
                  obscureText: false,
                  isLocked: false,
                ),
                const SizedBox(height: 20),

                 TextBox(
                  controller: _degreeController,
                  hintText: 'Degree',
                  obscureText: false,
                  isLocked: false,
                ),
                
                const SizedBox(height: 20),

                if (_isLoading)
                  CircularProgressIndicator(),
                if (!_isLoading)
                  MyButton(
                    buttonColor: Colors.lightBlue,
                    icon: Icon(Icons.add),
                    text: 'Sign Up',
                    onPressed: signUp,
                  ),

                if (message.isNotEmpty)
                Text(
                  message,
                  style: TextStyle(color: messageColor, fontWeight: FontWeight.bold), 
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  dynamic validator() {
    
    var valEmail = ValidatorService.validateEmail(_usernameController.text);
    
    if (valEmail != true) {
      return valEmail; 
    }

    var valPassword = ValidatorService.validatePasword(_passwordController.text,_confirmPasswordController.text);
    if (valPassword != true) {
      return valPassword;
    }

    var valName = ValidatorService.validateNames(_nameController.text, _surnameController.text);
    if (valName != true) {
      return valName;
    }
    if (_degreeController.text.isEmpty) {
      return 'Degree field is empty';
    }

    return true; 
  }

}
