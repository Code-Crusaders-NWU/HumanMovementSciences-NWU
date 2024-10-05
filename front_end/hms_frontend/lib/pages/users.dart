import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;

class UsersPage extends StatefulWidget {
  const UsersPage({super.key});

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Manage Users',
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
        child: Center(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          
          children: <Widget>[
            //Code hier binne asb
            MyButton(text: "Load Users", onPressed: getUsers),
            
          ],
        ),),
      
    ),
    );
  }

  void getUsers() async{
    try{
    http.Response apiResponse;

    //Change to Docker once built
    apiResponse = await http.get(Uri.parse("$apiURL/api/getAllUsers"));
    if (apiResponse.statusCode == 200){

      //Get all the users from the api request. Users is a dynamic variable
      var users = jsonDecode(apiResponse.body);
      print(users);
    }
    else{
      var res_body = jsonDecode(apiResponse.body);
      print(res_body['error']);
    }
        }
    catch (error){
      print(error);
      throw error;
    }
  }
}