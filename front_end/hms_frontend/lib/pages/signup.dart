import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;

class SignupScreen extends StatefulWidget {
  SignupScreen({super.key});

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  String? signupMessage; // To display signup status

  void signUp() async {
    if (usernameController.text.isNotEmpty &&
        passwordController.text.isNotEmpty) {
      if (passwordController.text == confirmPasswordController.text) {
        // API statement in JSON format
        var regBody = {
          "email": usernameController.text,
          "password": passwordController.text,
          "user_type": "student"
        };

        // Attempt to add user to database
        try {
          var res = await http.post(
            Uri.parse("$apiURL/api/signup"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(regBody),
          );

          if (res.statusCode == 201) {
            setState(() {
              signupMessage = 'Registration successful'; // Update message
              usernameController.clear(); // Clear fields
              passwordController.clear();
              confirmPasswordController.clear();
            });
          } else {
            setState(() {
              signupMessage =
                  'Registration failed: ${res.body}'; // Update message
            });
          }
        } catch (error) {
          setState(() {
            signupMessage = 'Error: $error'; // Handle error message
          });
        }
      } else {
        setState(() {
          signupMessage = 'Passwords do not match'; // Handle password mismatch
        });
      }
    } else {
      setState(() {
        signupMessage =
            'Username and password cannot be empty'; // Handle empty fields
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'SignUp',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // Display the signup message if available
              if (signupMessage != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Text(
                    signupMessage!,
                    style: TextStyle(
                      fontSize: 16,
                      color: signupMessage == 'Registration successful'
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

              // Username TextBox
              TextBox(
                controller: usernameController,
                hintText: 'email address',
                obscureText: false,
              ),

              const SizedBox(height: 20),

              // Password TextBox
              TextBox(
                controller: passwordController,
                hintText: 'password',
                obscureText: true,
              ),

              const SizedBox(height: 20),

              // Confirm Password TextBox
              TextBox(
                controller: confirmPasswordController,
                hintText: 'verify password',
                obscureText: true,
              ),

              const SizedBox(height: 20),

              // SignUp Button
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
    );
  }
}
