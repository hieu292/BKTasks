var User = require('../models/user');
var Events = require('../models/event');
var Status = require('../models/status');
var Tasks = require('../models/tasks');
var config = require('../../config');
var bayes = require('bayes');
var Dataset = require('../models/dataset');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        images: user.images,
        idUser: user.idUser
    }, secretKey, {
        expirtesInMinute: 1440
    });


    return token;

}

module.exports = function (app, express, io) {


    var api = express.Router();

    api.post('/signup', function (req, res) {
        if (req.body.username == '') {
            res.send({
                message: 'Username cannot be blank'
            });
            return;
        }

        if (req.body.password == '') {
            res.send({
                message: 'Password cannot be blank'
            });
            return;
        }
        if ((req.body.password).length < 8) {
            res.send({
                message: 'Password more than 8 characters'
            });
            return;

        }

        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            images: req.body.images
        });

        user.save(function (err) {
            if (err) {
                res.json({message: 'Username already used'});
                return;
            }

            res.json({
                success: true,
                message: 'User has been created!'
            });
        });
    });

    api.post('/login', function (req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password email images idUser').exec(function (err, user) {

            if (err) throw err;

            if (!user) {

                res.send({message: "User doenst exist"});
            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.send({message: "Invalid Password"});
                } else {


                    ///// token
                    var token = createToken(user);

                    res.json({
                        success: true,
                        message: "Successfuly login!",
                        token: token
                    });
                }
            }
        });
    });

    api.use(function (req, res, next) {

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // check if token exist
        if (token) {

            jsonwebtoken.verify(token, secretKey, function (err, decoded) {

                if (err) {
                    res.status(403).send({success: false, message: "Failed to authenticate user"});

                } else {

                    //
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, message: "No Token Provided"});
        }

    });


    // Destination B // provide a legitimate token
    api.route('/dataset')
        .post(function (req, res) {
            if(req.decoded.idUser == 1 || req.decoded.idUser == 2)
            {
                if((req.body.comment).length <= 10){
                    res.json({
                        success: false,
                        message: "Comment must be more 10 characters"
                    });
                    return;
                } else if((req.body.classify).length == 0 ){
                    res.json({
                        success: false,
                        message: "Category can't be blank"
                    });
                    return;
                } else {
                    var dataset = new Dataset({
                        comment: req.body.comment,
                        classify: req.body.classify
                    });
                    dataset.save(function (err) {
                      if(err) throw err;
                        res.json({
                           success: true,
                            message: "Added successfully"
                        });
                        io.emit('dataset', dataset);
                    });
                }
            }
        })
        .get(function (req, res) {
            if(req.decoded.idUser == 1 || req.decoded.idUser == 2)
            {
                Dataset.find({}, function (err, data) {
                    if(err) throw err;
                    res.send(data);
                })
            }
        });
    api.route('/deleteDataset')
        .post(function (req, res) {
            if (req.decoded.idUser == 1 || req.decoded.idUser == 2){
                Dataset.remove({_id: req.body._id}, function (err) {
                    if(err) throw err;
                    res.json({
                        success: true,
                        message: "Removed success"
                    });
                })
            }
        })
    api.route('/editDataset')
        .post(function (req, res) {
           if(req.decoded.idUser == 1 || req.decoded.idUser == 2){
               if((req.body.comment).length <= 10){
                   res.json({
                       success: false,
                       message: "Comment must be more 10 characters"
                   });
                   return;
               } else if((req.body.classify).length == 0 ){
                   res.json({
                       success: false,
                       message: "Category can't be blank"
                   });
                   return;
               } else {
               Dataset.findOne({_id: req.body.id}, function (err, data) {
                   if(err) throw err;
                   data.comment = req.body.comment;
                   data.classify = req.body.classify;
                   data.save(function (err,datareturn) {
                       if(err) throw err;
                       res.json({
                          success: true,
                           message: "Edit Successfully"
                       });
                       io.emit('datasetedit', datareturn);
                   });

               })
               }
           }
        });
    api.route('/addRole')
        .post(function (req, res) {
           if(req.decoded.idUser == 1 && req.body.username != 'admin' && req.body.username != ''){
               User.findOne({username: req.body.username}, function (err, user) {
                   if(err){
                       res.json({
                          success: false,
                           message: "False to add role"
                       });
                   } else {
                       user.idUser = req.body.idUser;
                       user.save();
                       res.json({
                           success: true,
                           message: "Add role was Successful"
                       });
                   }
               })
           }
        });
    api.route('/getListUser')
        .get(function (req, res) {
            if(req.decoded.idUser == 1){
                User.find({}).select("username idUser").exec(function (err, data) {
                    if(err) throw err;
                    res.send(data);
                })
            }
        });
    api.route('/deleteUser')
        .post(function (req, res) {
            if (req.decoded.idUser == 1){
                User.remove({username: req.body.username}, function (err) {
                    if(err) throw err;
                    res.json({
                        success: true,
                        message: "Removed success"
                    });
                })
            }
        })
    api.route('/deleteEvent')
        .post(function (req, res) {
            Events.findOneAndRemove({_id: req.body.id}, function (err) {
                    if (err) throw err;
                }
            );
        });
    api.route('/getAllEvents')
        .get(function (req, res) {
            Events.find({creator: req.decoded.id}).sort({_id: -1}).exec(function (err, allEvents) {
                if (err) {
                    res.send(err);
                    return;
                }

                res.send(allEvents);

            });
        });
    api.route('/saveEvent')
        .post(function (req, res) {
            Events.findOneAndUpdate({_id: req.body.id}, {
                title: req.body.data.title,
                info: req.body.data.info,
                start: req.body.data.start,
                end: req.body.data.end,
                allDay: req.body.data.allDay
            }, function (problem) {
                if (problem) {
                    res.json({
                        success: false,
                        message: 'Some errror expected!'
                    });
                    return;
                } else
                    res.json({
                        success: true
                    });
            });
        });
    api.route('/createEvent')
        .post(function (req, res) {
            var events = new Events({
                creator: req.decoded.id,
                title: req.body.title,
                info: req.body.info,
                start: req.body.start,
                end: req.body.end,
                allDay: req.body.allDay
            });
            events.save(function (err, data) {
                if (err) {
                    if (err) throw err;
                    return;
                }
                res.json({
                    success: true,
                    message: 'New Event has been created!'
                });
                io.emit('createEvent', data);
            });
        });

    api.route('/tasks')
        .post(function (req, res) {
            if ((req.body.data.describe).length <= 10) {
                res.send({
                    message: 'Describe must be more than 10 characters'
                });
                return;
            }
            if (req.body.data.nameTask == "") {
                res.send({
                    message: 'Task name cannot be blank'
                });
                return;
            }
            if (req.body.status) {
                var task = new Tasks({
                    creator: req.decoded.id,
                    nameTask: req.body.data.nameTask,
                    describe: req.body.data.describe,
                    priority: req.body.data.priority,
                    status: req.body.status,
                    startTime: req.body.data.startTime,
                    endTime: req.body.data.endTime,
                    timeSub: req.body.data.timeSub

                });
            }
            else
                var task = new Tasks({
                    creator: req.decoded.id,
                    nameTask: req.body.data.nameTask,
                    describe: req.body.data.describe,
                    priority: req.body.data.priority,
                    status: req.body.status


                });
            task.save(function (err, data) {
                if (err) {
                    if (err) throw err;
                    return;
                }

                res.json({
                    success: true,
                    message: 'New Task has been created!'
                });
                io.emit('createtask', data);
            });
        });
    api.route('/allTasks')
        .post(function (req, res) {

            Tasks.find({creator: req.decoded.id}).sort({_id: -1}).skip(req.body.count).limit(1).exec(function (err, tasks) {

                if (err) {
                    res.send(err);
                    return;
                }

                res.send(tasks);
            });
        });
    api.route('/get7Tasks')
        .get(function (req, res) {

            Tasks.find({creator: req.decoded.id}).sort({_id: -1}).limit(7).exec(function (err, tasks) {

                if (err) {
                    res.send(err);
                    return;
                }

                res.send(tasks);
            });
        });
    api.route('/taskOverview')
        .get(function (req, res) {
            var databack = {
                taskCompleted: 0,
                taskInprogess: 0,
                taskNonactive: 0
            };
            Tasks.count({creator: req.decoded.id, completed: true}, function (err, data1) {
                if(err) throw err;
                databack.taskCompleted = data1;
                Tasks.count({creator: req.decoded.id, completed: false, status: true}, function (err, data2) {
                    if(err) throw err;
                    databack.taskInprogess = data2;
                    Tasks.count({creator: req.decoded.id,completed: false, status: false }, function (err, data3) {
                        if(err) throw err;
                        databack.taskNonactive = data3;
                        res.send(databack);
                    });
                });
            });
        });
    api.route('/editTask')
        .post(function (req, res) {
            if ((req.body.data.describe).length <= 10) {
                res.send({
                    message: 'Describe must be more than 10 characters'
                });
                return;
            }
            if (req.body.data.nameTask == "") {
                res.send({
                    message: 'Task name cannot be blank'
                });
                return;
            }

            if (req.body.status) {
                Tasks.findOneAndUpdate({_id: req.body.id}, {status: req.body.status}, function (problem) {
                    if (problem) {
                        res.json({
                            success: false,
                            message: 'Some errror expected!'
                        });
                        return;
                    }
                });
            }
            Tasks.findOneAndUpdate({_id: req.body.id}, req.body.data, function (err) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Some errror expected!'
                    });
                    return;
                }


                res.json({
                    success: true,
                    message: 'Edit Task has been Successfuly!'
                });


            });

        });

    api.route('/deleteTask')
        .post(function (req, res) {
            Tasks.findOneAndRemove({_id: req.body._id}, function (err) {
                    if (err) throw err;
                }
            );
        });
    api.route('/updateWork')
        .post(function (req, res) {
            Tasks.findOne({_id: req.body.id}, function (err, task) {
                if (err) throw err;
                task.workTime += req.body.timework;
                task.interrupt += req.body.interrupt;
                task.save(function (err) {
                    if (err) throw err;

                });
            });

        });

    api.route('/update')
        .post(function (req, res) {

            if ((req.body.data).hasOwnProperty('password') && (req.body.data.password).length < 8) {
                res.send({
                    message: 'Password more than 8 characters'
                });
                return;

            }

            User.findOneAndUpdate({username: req.body.username}, req.body.data, function (err) {
                if (err) {
                    res.json({message: 'Username already used, you must change anthor username!'});
                    return;
                }
                if ((req.body.data).hasOwnProperty('username')) {
                    User.findOne({username: req.body.data.username}).select('name username password email images').exec(function (err, user) {

                        if (err) throw err;
                        ///// token
                        var token = createToken(user);
                        res.json({
                            success: true,
                            message: 'User has been update!',
                            token: token
                        });

                    });
                } else {
                    User.findOne({username: req.body.username}).select('name username password email images').exec(function (err, user) {

                        if (err) throw err;
                        ///// token
                        var token = createToken(user);
                        res.json({
                            success: true,
                            message: 'User has been update!',
                            token: token
                        });

                    });
                }
            });
        });

    api.route('/todayTask')
        .get(function (req, res) {
            var date = new Date();
            date.setHours(0,0,0);
            var nextdate = new Date();
            nextdate.setHours(0,0,0);
            nextdate.setDate(date.getDate()+1);
            Tasks.find({
                creator: req.decoded.id,
                startTime: {$lte: nextdate.toISOString()},
                endTime: {$gte: date.toISOString()},
                status: true,
                completed: false
            }, function (err, task) {
                if (err) throw err;
                res.send(task);
            });
        });
    api.route('/newTask')
        .get(function (req, res) {
            Tasks.find({creator: req.decoded.id, completed: false}).sort({_id: -1}).limit(5).exec(function (err, task) {
                if (err) throw err;
                res.send(task);
            });
        });
    api.route('/countAllTasks')
        .get(function (req, res) {
            Tasks.count({creator: req.decoded.id}, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    api.route('/totalTimework')
        .get(function (req, res) {
            Tasks.aggregate([{$group: {_id: "$creator", total: {$sum: "$workTime"}}}]).exec(function (err, data) {
                if(err) throw err;
                data.forEach(function (element) {
                    if (element._id == req.decoded.id)
                        res.json(element.total);
                });

            });
        });
    api.route('/totalEvents')
        .get(function (req, res) {
            Events.count({creator: req.decoded.id}, function (err, data) {
                if(err) throw err;
                res.json(data);
            })
        });
    api.route('/totalCompleted')
        .get(function (req, res) {
            Tasks.count({creator: req.decoded.id, completed: true}, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    api.route('/recentCompletedTask')
        .get(function (req, res) {
            Tasks.find({creator: req.decoded.id, completed: true}).sort({_id: -1}).limit(5).exec(function (err, task) {
                if (err) throw err;
                res.send(task);
            });
        });
    api.route('/status')
        .post(function (req, res) {
            var classifier = bayes();
            Dataset.find({}, function (err, dataset) {
                if (err) throw err;
                console.log(dataset);
                dataset.forEach(function (element) {
                    classifier.learn(element.comment, element.classify);
                });
                var result = classifier.categorize(req.body.content);

                var status = new Status({
                    creator: req.decoded.id,
                    content: req.body.content,
                    classify: result
                });

                status.save(function (err, newStatus) {
                    if (err) {
                        res.send(err);
                        return
                    }
                    io.emit('status', newStatus);
                    res.json({
                        success: true,
                        message: 'Your Status has been created!'
                    });
                });
            })

        })


        .get(function (req, res) {

            Status.find({creator: req.decoded.id}).sort({_id: -1}).limit(5).exec(function (err, status) {

                if (err) {
                    res.send(err);
                    return;
                }

                res.send(status);
            });
        });

    api.route('/getTodayEvents')
        .get(function (req, res) {
            var date = new Date();
            date.setHours(0,0,0);
            var nextdate = new Date();
            nextdate.setHours(0,0,0);
            nextdate.setDate(date.getDate()+1);
            Events.find({
                creator: req.decoded.id,
                start: {$lte: nextdate.toISOString()},
                end: {$gte: date.toISOString()}
            }).sort({_id: -1}).exec(function (err, events) {
                if (err) throw err;
                res.send(events);
            });
        });


    api.get('/me', function (req, res) {
        res.send(req.decoded);
    });


    return api;


}