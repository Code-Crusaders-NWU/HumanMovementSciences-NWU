import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/lecturers/createLecturersPage.dart';

class AdminPage extends StatefulWidget {
  const AdminPage({super.key});

  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Admin Page',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            
            //List of children in Body of App
            children: <Widget>[
              
              MyButton(
                text: 'View Users',
                onPressed: (){
                  print('Delete users pressed....');},
              ),

              const SizedBox(height: 10),

              MyButton(text: 'Create Lecturer', 
              onPressed: (){
                Navigator.push(context, MaterialPageRoute(builder: (context) => const CreateLecturersPage()));
                }),
              
              const SizedBox(height: 10),

              MyButton(text: 'Reserved Button', onPressed: (){
                print('Reserved Button pressed');
              })


            ],
          ),
        ),
      ),
    );
  }
}
