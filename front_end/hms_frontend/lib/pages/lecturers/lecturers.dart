import 'package:flutter/material.dart';
import 'package:hms_frontend/components/lecNavbar.dart';
import 'package:hms_frontend/components/myAppbar.dart';

class LecturerPage extends StatefulWidget {
  const LecturerPage({super.key});

  @override
  State<LecturerPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<LecturerPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: LecNavbar(),
      appBar: MyAppBar(titleText: "Lecturer's Page"),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget> [
            Image.asset(
                  'assets/nwu.png',
                  width: 150,
                  height: 150,
                  ),
                  const SizedBox(height: 5),

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
      );
  }
}
