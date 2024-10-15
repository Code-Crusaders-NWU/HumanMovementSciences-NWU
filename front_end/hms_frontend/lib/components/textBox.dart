import 'package:flutter/material.dart';

class TextBox extends StatelessWidget {
  final TextEditingController controller; 
  final String hintText;
  final bool obscureText;
  final bool isLocked;

  const TextBox({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obscureText,
    required this.isLocked,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 600,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 25.0),
        child: TextField(
          enabled: !isLocked,
          controller: controller,
          obscureText: obscureText,
          textAlign: TextAlign.start, 
      
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: Colors.grey.shade400),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Colors.grey.shade300, 
                width: 1.0, 
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Colors.blue, 
                width: 1.0,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Colors.grey.shade300,
                width: 1.0,
              ),
            ),
            contentPadding: EdgeInsets.symmetric(vertical: 12.0, horizontal: 12.0), 
          ),
        ),
      ),
    );
  }
}
