import 'package:flutter/material.dart';

class MyAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String titleText;
  final Color backgroundColor;

  const MyAppBar({
    Key? key,
    required this.titleText,
    this.backgroundColor = Colors.deepPurple,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        titleText,
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: backgroundColor,
      elevation: 4.0,
    );
  }

  
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
