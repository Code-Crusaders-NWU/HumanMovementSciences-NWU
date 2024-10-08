import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/login.dart'; 
import 'package:hms_frontend/components/myButton.dart'; 

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome'),
        backgroundColor: Colors.lightBlue,
        centerTitle: false, 
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // Image at the top
              Image.network(
                'https://services.nwu.ac.za/sites/services.nwu.ac.za/files/files/designs-branding/CMYK_NWU_Logo-Purple.png',
                width: 100,
                height: 100,
                errorBuilder: (context, error, stackTrace) {
                  // error handling for image
                  return Icon(
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

              const SizedBox(height: 40),

              // First button (IETS)
              MyButton(
                text: 'IETS',
                onPressed: () {
                  //iets by die button
                },
              ),

              const SizedBox(height: 20),

              // login button
              MyButton(
                text: 'Login',
                onPressed: () {
                  // Go to login page when pressed
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
