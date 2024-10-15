import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/adminNavbar.dart';

class AdminPage extends StatefulWidget {
  const AdminPage({super.key});

  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: AdminNavbar(),
      appBar: MyAppBar(titleText: "Admin's Page",),
      body: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Image.asset(
                    'assets/nwu.png',
                    width: 150,
                    height: 150,

                    //error handeling for button
                    errorBuilder: (context, error, stackTrace) {
                      return const Icon(
                        Icons.broken_image,
                        size: 100,
                        color: Colors.blueGrey,
                      );
                    },
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    'Welcome to NWU Human Movement Sciences!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.lightBlue,
                    ),
                  ),

                  const SizedBox(height: 10),

                  
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 30),
                    child: Text(
                      'The NWU Human Movement Sciences Digital Platform is an integrated solution designed to enhance the accessibility and engagement of Human Movement Sciences resources at North West University. This project includes both a website and mobile application, aimed at providing students and faculty with a seamless experience to access information, resources, and tools related to the School of Human Movement Sciences.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.black54,
                      ),
                    ),
                  ),
                ],
              ),
      );
  }
}
