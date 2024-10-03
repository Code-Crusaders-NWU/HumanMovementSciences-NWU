import 'package:flutter/material.dart';

class TextBox extends StatelessWidget {
  final controller;
  final String hintText;
  final bool obscureText;

  const TextBox({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obscureText,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        textAlign: TextAlign.center, // Centers the hintText and user input

        decoration: InputDecoration(
          hintText: hintText,
          enabledBorder:
              OutlineInputBorder(borderSide: BorderSide(color: Colors.black)),
        ),
      ),
    );
  }
}
