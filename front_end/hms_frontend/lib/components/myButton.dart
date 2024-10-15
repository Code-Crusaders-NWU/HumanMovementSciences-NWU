import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final String text;
  final VoidCallback
      onPressed; //This is to make the button functionality adaptable
  final Color buttonColor; // to make the button color changeable
  final Icon? icon; //Icon can be empty

  const MyButton({
    super.key,
    required this.text,
    required this.onPressed,
    required this.buttonColor,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      child: ElevatedButton.icon(
                        onPressed: onPressed,
                        icon: icon != null 
                        ? Icon(icon!.icon, color: Colors.white)
                        : const SizedBox.shrink(),
                        label: Text(
                          text,
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                          backgroundColor: buttonColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5.0),
                          ),
                        ),
                      ),
    );
  }
}
