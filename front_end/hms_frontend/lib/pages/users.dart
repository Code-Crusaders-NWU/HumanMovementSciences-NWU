import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/users.services.dart';
import 'package:http/http.dart' as http;

class UsersPage extends StatefulWidget {
  const UsersPage({super.key});

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage> {

List<Map<String, dynamic>> users= []; //List of json objects (MAP) which will be used to dynamically populate the page

 @override
  void initState() {
    super.initState();
    getUsers(); //populate user list
  }


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
      body: Container(
        padding: EdgeInsets.all(16.0),
        child: Center(child: ListView.builder(
          itemCount: users.length,
          itemBuilder: (context, index){ //Basically a for loop to populate the page with cards of users
            final u = users[index];
            return Container(
              margin:const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              decoration: BoxDecoration(
                color: index % 2 == 0 ? Colors.lightBlue[50] : Colors.lightGreen[50],
                borderRadius:  BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(color: Colors.grey.withOpacity(0.5), 
                  spreadRadius: 2,
                  blurRadius: 5,
                  offset: const Offset(0, 3),)
                ]
              ),
              child: ListTile(
              title :Text(u['email'],
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.black87,
              ),
              ),
              subtitle: Text(u['user_type'],
              style: const TextStyle(fontSize: 12, color: Colors.black54),
              ),
              trailing: IconButton(icon: const Icon(Icons.delete),
              color: Colors.redAccent,
              onPressed: (){},),
            ),
            )
            ;
          },
          
        ),),
      
    ),
    );
  }

  void getUsers() async{
    try{
        final fetchUsers = await UserService().fetchUsers();
        setState(() async {
          users = fetchUsers;
        });
    }
    catch(e){
      throw "$e";
    }
  }
}