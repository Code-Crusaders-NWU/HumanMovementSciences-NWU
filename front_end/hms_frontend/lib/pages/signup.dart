import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/users.services.dart';
import 'package:http/http.dart' as http;

class SignupScreen extends StatefulWidget {
  SignupScreen({super.key});

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();

  String _signupMessage = ""; 
  bool _isLoading = false;    

  void signUp() async {
    if (validator()) {
      setState(() {
        _isLoading = true;
      });
      var success = await UserService().signUp(
        _usernameController.text,
        _passwordController.text,
        _nameController.text,
        _surnameController.text,
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
  }

  void _clearFields() {
    _usernameController.clear();
    _passwordController.clear();
    _confirmPasswordController.clear();
    _nameController.clear();
    _surnameController.clear();
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
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _passwordController,
                  hintText: 'password',
                  obscureText: true,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _confirmPasswordController,
                  hintText: 'verify password',
                  obscureText: true,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _nameController,
                  hintText: 'Name',
                  obscureText: false,
                ),
                const SizedBox(height: 20),

                TextBox(
                  controller: _surnameController,
                  hintText: 'Surname',
                  obscureText: false,
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
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  bool validator() {
    String email = _usernameController.text;
    String password = _passwordController.text;
    String confirmPassword = _confirmPasswordController.text;
    String name = _nameController.text;
    String surname = _surnameController.text;

    final bool emailMatch = RegExp(
        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
        .hasMatch(email);

    if (email.isEmpty || !emailMatch) {
      setState(() {
        _signupMessage = "Please enter a valid email address";
      });
      return false;
    }
    if (password.isEmpty || password != confirmPassword || password.length > 30 || password.length < 8 ) {
      setState(() {
        _signupMessage = "Passwords must match and be between 5 and 50 chars long";
      });
      return false;
    }
    if (name.isEmpty || surname.isEmpty) {
      setState(() {
        _signupMessage = "Please enter both name and surname";
      });
      return false;
    }

    return true;
  }
}
