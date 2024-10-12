
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:hms_frontend/components/stuNavBar.dart';


class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: StuNavBar(),
      appBar: AppBar(title: Title(color: Colors.blue,child:  const Text('Home', style: TextStyle(color: Colors.white),),),
      backgroundColor: Colors.deepPurple,
      ),
      body: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
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
            ),
          ),
        ],
      ),
      );
  }
}