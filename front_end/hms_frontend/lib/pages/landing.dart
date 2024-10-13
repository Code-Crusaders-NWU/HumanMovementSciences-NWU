import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/login.dart'; // Import your LoginScreen
//import 'package:hms_frontend/components/myButton.dart'; // Import your custom MyButton

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isMenuOpen = false; // check to see if menu is open

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleMenu() {
    setState(() {
      if (_isMenuOpen) {
        _controller.reverse(); // Close menu
      } else {
        _controller.forward(); // Open menu
      }
      _isMenuOpen = !_isMenuOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Welcome',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
        actions: [
          IconButton(
            icon: AnimatedIcon(
              icon: AnimatedIcons.menu_home,
              progress: _controller,
              size: 40, 
            ),
            onPressed: _toggleMenu,
          ),
        ],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Center(
              child: Column(
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
            ),
          ),

          // Dropdown menu
          if (_isMenuOpen)
            Positioned(
              top: kToolbarHeight + 2,
              right: 10,
              child: Material(
                elevation: 8,
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  padding: const EdgeInsets.all(10),
                  width: 200, 
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextButton(
                        onPressed: () {
                          
                          _toggleMenu(); // Close the menu
                        },
                        child: const Text('IETS'),
                      ),
                      const Divider(),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => LoginScreen()),
                          );
                          _toggleMenu(); // Close menu
                        },
                        child: const Text('Login'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
