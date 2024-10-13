import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';

class SubmissionsPageView extends StatefulWidget {
  const SubmissionsPageView({super.key});

  @override
  State<SubmissionsPageView> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<SubmissionsPageView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(
        titleText: "Submissons",
        backgroundColor: Colors.lightBlue,
      ),
    );
  }
}