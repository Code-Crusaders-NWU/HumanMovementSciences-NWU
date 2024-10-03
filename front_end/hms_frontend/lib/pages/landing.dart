import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          
          children: <Widget>[
            //Code hier binne asb
            
          ],
        ),),
      
    ),
    );
  }
}