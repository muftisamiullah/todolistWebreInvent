<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function createTask(Request $request)
    {
        try {
            $rules = [
                'taskname'=>'required|unique:tasks',
            ];
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json(['success' => false, 'error' => $validator->messages()->first()], 400);
            }
            $task = Task::create([
                'taskname'=>$request->taskname,
            ]);
            if ($task) {
                return response()->json(['success'=>true, 'Message' => 'success'], 200);
            } else {
                return response()->json(['success'=>false, 'error' => 'Failed'], 500);
            }
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }

    public function getAllTasks()
    {
        try {
            $tasks = Task::get();
            if (!count($tasks)) {
                return response()->json(['success'=>false, 'Message' => 'No Data Found'], 404);
            }
            return response()->json(['success'=>true, 'data' => $tasks], 200);
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }

    public function getCompletedTasks()
    {
        try {
            $tasks = Task::where('status', '=', 'complete')->get();
            if (!count($tasks)) {
                return response()->json(['success'=>false, 'Message' => 'No Data Found'], 404);
            }
            return response()->json(['success'=>true, 'data' => $tasks], 200);
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }

    public function getInCompletedTasks()
    {
        try {
            $tasks = Task::where('status', '=', 'incomplete')->get();
            if (!count($tasks)) {
                return response()->json(['success'=>false, 'Message' => 'No Data Found'], 404);
            }
            return response()->json(['success'=>true, 'data' => $tasks], 200);
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }

    public function deleteTask($id)
    {
        try {
            $data = Task::where('id', $id)->first();
            if (!$data) {
                return response()->json(['success'=>false, 'Message' => 'No Data Found'], 404);
            }
            if ($data->delete()) {
                return response()->json(['success'=>true, 'Message' => 'Deleted'], 200);
            }
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }

    public function changeStatus($id)
    {
        try {
            $data = Task::where('id', $id)->where('status', 'incomplete')->first();
            if (!$data) {
                return response()->json(['success'=>false, 'Message' => 'No Data Found'], 404);
            }
            $data->status = "complete";
            if ($data->save()) {
                return response()->json(['success'=>true, 'Message' => 'Task Completed'], 200);
            }
        } catch (Exception $error) {
            return response()->json(['success'=>false, 'error' => $error], 500);
        }
    }
}
