Live File
=========

live-file is a simple utility to allow you to watch a remote file in realtime on your browser via websockets. It's not meant to be a nice finished product it's just a hacked together tool.

Features
========

* Realtime streaming over webockets
* Infinite upward scroll simulates terminal application
* easy to install and run, few dependencies

Install and Run
===============

You can install live-file using npm. Be sure to use -g option:

```
  npm install live-file -g
```

To run, all you need to do is run the command and pass it a file:

```
  live-file --file /var/log/system.log
```

Point your browser at [http://localhost:8888](http://localhost:8888) to see the results.

You have a few extra options:

```
  live-file --file /var/log/system.log --port 3000 --backlog 10000
```

--port is the webserver port and --backlog is the number of bytes to send to the client at a time.

Browser Support
===============

I have only tested this on Firefox :/

Contributors
============

I borrowed some code from around github but I can't seem to find all the sources. I know this guy was involved:

[karmi](https://github.com/karmi)

Improvements
============

fs#watchFile seems to be kind of slow. I imagine there are better ways to do this now. I might change this soon.


