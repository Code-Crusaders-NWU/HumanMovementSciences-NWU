import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/signup.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;



class LoginScreen extends StatelessWidget { 
  LoginScreen({super.key});

  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  //login function
  void login() async{
    if (usernameController.text.isNotEmpty && passwordController.text.isNotEmpty){
      
      //API request's body in json format
      var body = {
          "email": usernameController.text,
          "password": passwordController.text
        };

try {
          var res = await http.post(
            Uri.parse("$apiURL/api/login"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(body),
          );

          if (res.statusCode == 201) {
            print('Login successful');
          } else {
            print('Login failed: ${res.body}');
          }
        } catch (error) {
          print('Error: $error');
        }
      } else {
        print('Passwords do not match');
      }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'LOGIN',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            
            children: <Widget>[
              //Text wdiget to display nice message
              const Card(elevation: 20 ,
              color: Colors.lightBlueAccent,
              child: Padding(
                padding: EdgeInsets.all(15.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    SizedBox(height: 8),
                    Text('HMS NWU',
                    style: TextStyle(fontSize: 19,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,),)
                  ],
                  ),
                  ),
              ),

              const SizedBox(height: 20),
              
              //Username TextBox
              TextBox(
                controller: usernameController,
                hintText: 'email',
                obscureText: false,
              ),

              const SizedBox(height: 20),

              //Password TextBox
              TextBox(
                controller: passwordController,
                hintText: 'password',
                obscureText: true,
              ),

              const SizedBox(height: 20),
              
              //Login Button
              MyButton(
                text: 'Login',
                onPressed: ()
                {
                  print('logged in');
                },
              ),

              const SizedBox(height: 10),
              //SignUp Button
              MyButton(
                text: 'SignUp',
                onPressed: (){
                  Navigator.push(context, MaterialPageRoute(builder: (context) => SignupScreen()));
                  },
              )
            ],
          ),
        ),
      ),
    );
  }
}//class
