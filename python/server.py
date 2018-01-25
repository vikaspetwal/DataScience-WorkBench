# -*- coding: utf-8 -*-
"""
Created on Tue Sep 19 17:08:24 2017

@author: dnathani
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Sep 18 15:13:22 2017

@author: dnathani
"""

# -*- coding: utf-8 -*-
"""
Created on Thu Sep 07 11:58:02 2017

@author: dnathani
"""

# -*- coding: utf-8 -*-
"""
Created on Wed Sep 06 14:39:48 2017

@author: dnathani
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Aug 28 14:49:47 2017

@author: dnathani
"""

from flask import request
import os
from flask import Flask
from sklearn import cross_validation
from sklearn.metrics import accuracy_score
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import precision_recall_fscore_support
from sklearn.preprocessing import MinMaxScaler
import pickle
import json
import csv
from flask import Response
import random
import ConfigParser
import numpy as np
from sklearn.decomposition import PCA


###############################################################################
#Configuration
###############################################################################


class Configuration():
    def proxies(self):
        proxy = 'http://proxy-src.research.ge.com:8080'
        os.environ['RSYNC_PROXY'] = "proxy-src.research.ge.com:8080"
        os.environ['http_proxy'] = proxy
        os.environ['HTTP_PROXY'] = proxy
        os.environ['https_proxy'] = proxy
        os.environ['HTTPS_PROXY'] = proxy
        os.environ['no_proxy'] = ".ge.com"

###############################################################################
#Flask Configuration
###############################################################################
            
app = Flask(__name__, static_url_path="", static_folder="static")
app.secret_key = os.urandom(24)


###############################################################################
#Class Decleration
############################################################################### 

#------------------------------------------------------------------------------
#Utility
#------------------------------------------------------------------------------ 
def isfloat(value):
  try:
    float(value)
    return True
  except ValueError:
    return False

def checkColumn(lineNumber,columnNumber,rows,row_data):
    tempStringCheck=True
    for index in range(0,rows):
        tempStringCheck=tempStringCheck and not isfloat(row_data[index][columnNumber])
    return tempStringCheck

    
def rank_to_percentage(ranks, order=1):
    minmax = MinMaxScaler()
    ranks = minmax.fit_transform(order*np.array([ranks]).T).T[0]
    ranks = map(lambda x: round(x, 2), ranks)
    return ranks        

class Read_config():
    Config = ConfigParser.ConfigParser()
    Config.read(".\Config\Config.ini")
    ModelPath = Config.get('SectionOne', 'ModelPath')
    FilePath = Config.get('SectionOne', 'FilePath')

#Use this if you want to upload without config File
    
class relative_config():
    ModelPath = ".\Models\\"
    FilePath =  "..\Uploads"  
                
#******************************************************************************
#Data Splitting
#****************************************************************************** 


class DataSplitting():
    def process_initializer(self,Filename,Training,Testing,userID):
        self.rowsData=[]
        self.rowNumber=0
        self.FileResult=[]
        self.FileData=[]
        self.Filename = Filename
        self.Training = Training
        self.Testing = Testing
        self.userID = userID
        self.invalidColumn=[]
        self.filepath=os.path.join(Read_config.FilePath,self.Filename)
        self.Training_data=[]
        self.Training_Result=[]
        self.Testing_data=[]
        self.Testing_Result=[]
        self.columnResults=[]
        self.new_col_result=[]
        self.group=[]
        self.colorData=[]
        self.results=[]
        self.attributeValidity=[]
        self.groupingData=[]
        self.newAttributeValidity=[]
        self.invalidRows=[]
        self.rank=[]
        self.importance=[]


    def read_data(self):
        with open(self.filepath,"r") as f:
                reader = csv.reader(f,delimiter = ",")
                self.columns=reader.next()
                for row in reader:
                    self.rowsData.append(row)
                    self.rowNumber = self.rowNumber + 1
                for newLine in range(0,len(self.rowsData)):
                    temp2=[]
                    flag=True
                    for dataindex in range(0,(len(self.columns)-1)):
                        if isfloat(self.rowsData[newLine][dataindex]):
                            temp2.append(float(self.rowsData[newLine][dataindex]))
                        else:
                            if newLine == 0:
                                if not isfloat(self.rowsData[newLine+1][dataindex]):
                                    temp2.append(0.0)
                                else:
                                    temp2.append(0.0)
                                    flag=False
                            elif newLine == (len(self.rowsData)-1):
                                if not isfloat(self.rowsData[newLine-1][dataindex]):
                                    temp2.append(0.0)
                                else:
                                    temp2.append(0.0)
                                    flag=False                                    
                            elif isfloat(self.rowsData[newLine-1][dataindex]) and isfloat(self.rowsData[newLine+1][dataindex]):
                                previosData=self.rowsData[newLine-1][dataindex]
                                nextData=self.rowsData[newLine+1][dataindex]
                                temp2.append((float(previosData)+float(nextData))/2)
                                flag=False
                            elif isfloat(self.rowsData[newLine-1][dataindex]) and  not isfloat(self.rowsData[newLine+1][dataindex]):
                                previosData=self.rowsData[newLine-1][dataindex]
                                temp2.append(float(previosData))
                                flag=False
                            elif isfloat(self.rowsData[newLine+1][dataindex]) and  not isfloat(self.rowsData[newLine-1][dataindex]):
                                nextData=self.rowsData[newLine+1][dataindex]
                                temp2.append(float(nextData))
                                flag=False
                            elif not checkColumn(newLine,dataindex,len(self.rowsData),self.rowsData):
                                flag=False
                            else:
                                temp2.append(0.0)
                    self.FileResult.append(str(self.rowsData[newLine][len(self.columns)-1]))
                    if flag:
                        self.FileData.append(temp2)
                    else:
                        self.invalidRows.append(newLine)
                self.rowNumber=len(self.FileData)

    def remove_invalid_column(self):
        try:
            for data in range(0,len(self.FileData[0])):
                count=0
                for data2 in range(0,len(self.FileData)):
                    count +=self.FileData[data2][data]
                if count == 0.0:
                    for data2 in range(0,len(self.FileData)):
                        del self.FileData[data2][data]
                    self.invalidColumn.append(data)
                    del self.columns[data]
            for data in self.invalidRows:
                del self.FileResult[data]
        except Exception as err:
            raise Exception("Error In CSV file, Please use a valid CSV"+str(err))
                
    def extracting_data(self):
        try:
            self.read_data()
            self.remove_invalid_column()
        except Exception as err:
            raise Exception("Error while reading CSV :{}".format(err))    
    
    
    def attribute_validity(self):
        try:
            X_train, X_test, y_train, y_test = cross_validation.train_test_split(self.FileData, self.FileResult, test_size=0.2,random_state=5)
            model = DecisionTreeClassifier(random_state=5)
            rfe = RFE(model,n_features_to_select=1)
            fit = rfe.fit(self.FileData, self.FileResult)
            self.rank=fit.ranking_.tolist()
            self.importance=rank_to_percentage(map(float, rfe.ranking_), order=-1)
            if (len(self.columns)-1) <= 5:
                data = [True] * (len(self.columns)-1)
                self.attributeValidity=data
            else:
                model = DecisionTreeClassifier(random_state=5)
                rfe = RFE(model, int(len(self.columns)*0.4))
                rfe = rfe.fit(self.FileData, self.FileResult)
                self.attributeValidity=rfe.support_.tolist()
        except Exception as err:
             raise Exception("Error while selecting Attributes."+str(err))
    
    def generate_random_distribution(self):
        try:
            with open(self.filepath,"r") as f:
                    reader = csv.reader(f,delimiter = ",")
                    self.columns = reader.next()
                    data = list(reader)
                    row_count = len(data)-len(self.invalidRows)
                    trainEnd=int(((row_count*self.Training)+1)/100)
                    testEnd=int(int((row_count*self.Training)+1+int(row_count*self.Testing)+1)/100)
                    randomList=random.sample(range(0,row_count), row_count)
                    self.trainingData=[]
                    self.testingData=[]
                    for data in range(0,trainEnd):
                        self.trainingData.append(randomList[data])
                    for data in range(trainEnd,testEnd):
                        self.testingData.append(randomList[data])
        except Exception:
             raise Exception("Error while generating random array.")
                    
    def spliting_data(self):
        try:
            with open(self.filepath,"r") as f:
                    rowsData=[]
                    reader = csv.reader(f,delimiter = ",")
                    for row in reader:
                        rowsData.append(row)       
                    for data in self.trainingData:
                        self.Training_data.append(self.FileData[data])
                        self.Training_Result.append(self.FileResult[data])                    
                    for data in self.testingData:
                        self.Testing_data.append(self.FileData[data])
                        self.Testing_Result.append(self.FileResult[data])                
                    for data in self.invalidColumn:
                        del self.columns[data]
        except Exception as err:
             raise Exception("Error while spliting CSV."+str(err))    
             
    def extract_columns(self):
        try:
            for data in range(len(self.FileData[0])):
                self.new_col_result.append([self.FileData[i][data] for i in range(0,len(self.FileData))])
            self.new_col_result.append(self.FileResult)
            self.newAttributeValidity=self.attributeValidity
            self.groupingData=range(0,len(self.columns)-1)
            self.groupingData.append(0)
            uniqueData=set()
            for data in self.new_col_result[len(self.columns)-1]:
                uniqueData.add(data)
            self.UniqueList=list(uniqueData)
        except Exception as err:
             raise Exception("Error while reading columns."+ str(err))
             
    def grouping_data(self):
        try:
            for data in range(0,len(self.columns)-1):
                self.group.append(zip(self.new_col_result[self.groupingData[data]],self.new_col_result[self.groupingData[data+1]]))
            for data in range(0,len(self.columns)):
                tempColor=[]
                tempColor.append(int(random.random()*255))
                tempColor.append(int(random.random()*255))
                tempColor.append(int(random.random()*255))
                self.colorData.append(tempColor)
        except Exception:
             raise Exception("Error while generating groups.")   
             
    def split_data(self):
        try:
            self.generate_random_distribution()
            self.spliting_data()
            self.extract_columns()
            self.grouping_data()
        except Exception as err:
             raise Exception("{} Please check CSV".format(err))      
             
    def generate_json(self):
        try:
            for columnIndex in range(0,len(self.columns)-1):
                    tempJsonData=[]
                    histJson=[]
                    colorCount=0
                    for classificationData in self.UniqueList:
                        mesData=[]
                        histData=[]
                        for data in range(0,len(self.new_col_result[len(self.columns)-1])):
                            if self.new_col_result[len(self.columns)-1][data] == classificationData:
                                mesData.append(self.group[columnIndex][data])
                                #histData.append(self.new_col_result[columnIndex][data])
                        tempColorData="rgba({}, {}, {}, .5)".format(self.colorData[colorCount][0],self.colorData[colorCount][1],self.colorData[colorCount][2])        
                        tempJsonData.append({"name":classificationData,"data":mesData,"color":tempColorData})
                        #histJson.append({"name":classificationData,"data":histData})
                        colorCount += 1
                    tempRelevance = ""
                    if self.newAttributeValidity[columnIndex]:
                        tempRelevance="Relevent"
                    else:
                        tempRelevance="Irrelevent"
                    self.results.append({"attributeName":self.columns[columnIndex],"attributeData":tempJsonData,"HistogramData":histJson, "RelevanceValue": tempRelevance,"Relevance":self.newAttributeValidity[columnIndex],"Rank":self.rank[columnIndex],"Importance":self.importance[columnIndex]})
                    self.graphData= {"data": self.results}
            self.AttributeDataJson = {"Configuration":[{"FileName": self.Filename,"columns": self.columns, "rowNumber": self.rowNumber, "Training_data": self.Training_data, "Training_Result": self.Training_Result, "Testing_data": self.Testing_data, "Testing_Result": self.Testing_Result, "UniqueList": self.UniqueList}]}
        except Exception as err:
            raise Exception("There is some unexpeted character in your CSV or CSV data is in incompatible format."+str(err))   
            
    def store_config(self):
        try:
            with open(self.userID+".json", 'w') as outfile:
                json.dump(self.AttributeDataJson, outfile)      
        except Exception as err:
             raise Exception("Error while Storing Json "+str(err))              
      
    def get_attribute_data(self):
        return self.graphData

#******************************************************************************
#Data Filtering
#****************************************************************************** 
    
class Filtering():
    
    def process_initializer(self,userID,input_json):
        self.userID = userID
        self.input_json = input_json
        self.finalAttributes=[]
        self.FinalAttributeCount=0
        self.Filtered_traning_data=[] 
        self.Filtered_testing_data=[] 
        
    def read_config(self):
        try:
            with open(self.userID+'.json') as json_data:
                input_json2 = json.load(json_data)
            self.Filename = input_json2["Configuration"][0]["FileName"]
            self.columns = input_json2["Configuration"][0]["columns"]
            self.rowNumber = input_json2["Configuration"][0]["rowNumber"]
            self.Training_data = input_json2["Configuration"][0]["Training_data"]
            self.Training_Result = input_json2["Configuration"][0]["Training_Result"]
            self.Testing_data = input_json2["Configuration"][0]["Testing_data"]
            self.Testing_Result = input_json2["Configuration"][0]["Testing_Result"]
            self.UniqueList = input_json2["Configuration"][0]["UniqueList"]
        except Exception:
             raise Exception("Error while Reading Json")      
             
    def get_selected_attributes(self):
        try:
            Jsonkeys=self.input_json.keys()
            for data in self.columns:
                if data in Jsonkeys:
                    if self.input_json[data]:
                        self.finalAttributes.append(data)
                        self.FinalAttributeCount += 1
        except Exception:
            raise Exception("Incorrect input Json, Please provide a valid Json")               
    def filter_data(self):           
        try:
            for data in self.Training_data:
                temp=[]
                for columnData in self.finalAttributes:
                    temp.append(data[self.columns.index(columnData)])
                self.Filtered_traning_data.append(temp) 
            for data2 in self.Testing_data:
                temp2=[]
                for columnData in self.finalAttributes:
                    temp2.append(data2[self.columns.index(columnData)])
                self.Filtered_testing_data.append(temp2)
        except Exception:
            raise Exception("Error while filtering data according to Attributes selected. ") 
     
    def generate_json(self):
        try:
            self.AttributeDataJson={"Configuration":[{"FileName": self.Filename,
                                                 "columns": self.columns,
                                                 "rowNumber": self.rowNumber,
                                                 "Training_data": self.Training_data,
                                                 "Training_Result": self.Training_Result,
                                                 "Testing_data": self.Testing_data,
                                                 "Testing_Result": self.Testing_Result,
                                                 "UniqueList":self.UniqueList,
                                                 "finalAttributes":self.finalAttributes,
                                                 "FinalAttributeCount":self.FinalAttributeCount,
                                                 "Filtered_traning_data":self.Filtered_traning_data,
                                                 "Filtered_testing_data":self.Filtered_testing_data
                                                 }]}
    
        except Exception:
            raise Exception("Error while creating Json ")     
    
    def store_config(self):
        try:
            with open(self.userID+".json", 'w') as outfile:
                json.dump(self.AttributeDataJson, outfile)  
        except Exception:
             raise Exception("Error while Storing Json")   

#******************************************************************************
#Model Training 
#****************************************************************************** 

class Training():
    
    def process_initializer(self,userID,classifierName):
        self.userID = userID 
        self.classifierName = classifierName 
        self.sampleRowData=[]
        self.precisionDT=[]
        self.precisionKNN=[]
        self.precisionDataDT=[]
        self.precisionDataKNN=[]
        
    def read_config(self):
        try:
            with open(self.userID+'.json') as json_data:
                input_json = json.load(json_data)
            self.Filename = input_json["Configuration"][0]["FileName"]        
            self.columns = input_json["Configuration"][0]["columns"]
            self.rowNumber = input_json["Configuration"][0]["rowNumber"]
            self.Training_data = input_json["Configuration"][0]["Training_data"]
            self.Training_Result = input_json["Configuration"][0]["Training_Result"]
            self.Testing_data = input_json["Configuration"][0]["Testing_data"]
            self.Testing_Result = input_json["Configuration"][0]["Testing_Result"]
            self.UniqueList = input_json["Configuration"][0]["UniqueList"]
            self.finalAttributes = input_json["Configuration"][0]["finalAttributes"]
            self.FinalAttributeCount = input_json["Configuration"][0]["FinalAttributeCount"]
            self.Filtered_traning_data = input_json["Configuration"][0]["Filtered_traning_data"]
            self.Filtered_testing_data = input_json["Configuration"][0]["Filtered_testing_data"]
        except Exception:
             raise Exception("Error while Reading Json")        
             
    def get_row_data(self):
        try:
            for data in self.Filtered_traning_data[len(self.Filtered_traning_data)-1]:
                self.sampleRowData.append(data)
            self.sampleRowData.append(self.Training_Result[len(self.Training_Result)-1])
        except Exception:
            raise Exception("Error while extracting sample row data")
        
    def train_decisionTree(self):
        try:
            acc=[]
            for data in range(1,16):
                trainerDT=DecisionTreeClassifier(random_state=data)
                trainerDT=trainerDT.fit(self.Filtered_traning_data,self.Training_Result)
                prediction_DT=trainerDT.predict(self.Filtered_testing_data)
                acc.append(accuracy_score(self.Testing_Result,prediction_DT))
            final_random_state_value=(acc.index(max(acc)) + 1 )
            trainerDT=DecisionTreeClassifier(random_state=final_random_state_value)
            trainerDT=trainerDT.fit(self.Filtered_traning_data,self.Training_Result)
            pickle.dump(trainerDT, open(Read_config.ModelPath+os.path.splitext(self.Filename)[0]+".sav", 'wb'))
        except Exception as err:
            raise Exception("Error while training Decision Tree,Training Data in incorrect Format" + str(err))
    
    def train_Knn(self):
        try:
            acc=[]
            for data in range(5,30,5):                
                trainerKNN=KNeighborsClassifier(n_neighbors=data)
                trainerKNN=trainerKNN.fit(self.Filtered_traning_data,self.Training_Result)
                prediction_KNN=trainerKNN.predict(self.Filtered_testing_data)
                acc.append(accuracy_score(self.Testing_Result,prediction_KNN))
            final_k_value=(acc.index(max(acc)) + 1 )* 5
            trainerKNN=KNeighborsClassifier(n_neighbors=final_k_value)
            trainerKNN=trainerKNN.fit(self.Filtered_traning_data,self.Training_Result)
            pickle.dump(trainerKNN, open(Read_config.ModelPath+os.path.splitext(self.Filename)[0]+".sav", 'wb'))             
        except Exception:
            raise Exception("Error while training KNN Classifier,Make sure you have atleast 5 rows of Training")
            
    def get_Accuracy_precision_DT(self):
        try:
            loaded_model_DT = pickle.load(open(Read_config.ModelPath+os.path.splitext(self.Filename)[0]+".sav", 'rb'))
            prediction_DT=loaded_model_DT.predict(self.Filtered_testing_data)
            self.DT_accuracy=0
            self.DT_accuracy += accuracy_score(self.Testing_Result,prediction_DT)
            self.precisionDataDT=precision_recall_fscore_support(self.Testing_Result, prediction_DT)[0].tolist()
            self.precisionDT=[]        
            for data in self.precisionDataDT:
                self.precisionDT.append(data/(sum(self.precisionDataDT)))
        except Exception:
            raise Exception("Error while calculating Accuracy,Testing Data in incorrect Format")    
            
    def get_Accuracy_precision_KNN(self):
        try:
            loaded_model_KNN = pickle.load(open(Read_config.ModelPath+os.path.splitext(self.Filename)[0]+".sav", 'rb'))
            prediction_KNN=loaded_model_KNN.predict(self.Filtered_testing_data)
            self.Training_Result =0
            self.Training_Result =accuracy_score(self.Testing_Result,prediction_KNN)
            self.precisionDataKNN=precision_recall_fscore_support(self.Testing_Result, prediction_KNN)[0].tolist()
            self.precisionKNN=[]
            for data in self.precisionDataKNN:
                self.precisionKNN.append(data/(sum(self.precisionDataKNN)))
        except Exception:
            raise Exception("Error while calculating Accuracy,Testing Data in incorrect Format") 
                
    def genarate_json_DT(self):
        try: 
             column_names=[]
             for data in self.finalAttributes:
                column_names.append(data.replace("_", " "))
             column_names.append("Result")
             training_result={"accuracy":self.DT_accuracy*100,"totalNumberOfRows":self.rowNumber,"numberOfRowsForTraining":len(self.Training_data),"numberOfRowsForTesting":len(self.Testing_data),"totalNumberOfAttributes":len(self.columns)-1,"numberOfAttributesUsed":self.FinalAttributeCount,"rowData":self.sampleRowData,"columnData":column_names,"classifier":"DecisionTree","classification":self.UniqueList,"Precision":self.precisionDataDT,"Filename":self.Filename}
             return training_result
        except Exception:
            raise Exception("Error while generating Decision Tree Classifier Json")     
    def genarate_json_KNN(self):
        try: 
             column_names=[]
             for data in self.finalAttributes:
                column_names.append(data.replace("_", " "))
             column_names.append("Result")
             training_result={"accuracy":self.Training_Result*100,"totalNumberOfRows":self.rowNumber,"numberOfRowsForTraining":len(self.Training_data),"numberOfRowsForTesting":len(self.Testing_data),"totalNumberOfAttributes":len(self.columns)-1,"numberOfAttributesUsed":self.FinalAttributeCount,"rowData":self.sampleRowData,"columnData":column_names,"classifier":"KNN","classification":self.UniqueList,"Precision":self.precisionDataKNN,"Filename":self.Filename}
             return training_result        
        except Exception:
            raise Exception("Error while generating KNN Classifier Json") 
            
    def model_train(self):
        try:
            if self.classifierName.lower() == "decision_tree":
                self.train_decisionTree()
                self.get_Accuracy_precision_DT()
                return json.dumps(self.genarate_json_DT())
            if self.classifierName.lower() == "knn":    
                self.train_Knn()
                self.get_Accuracy_precision_KNN()
                return json.dumps(self.genarate_json_KNN())      
        except Exception as err:
            raise Exception("{}, Please perform Previous steps properly".format(err)) 
        
###############################################################################
#Training
###############################################################################

#******************************************************************************
#Attribute Selection (First Call)
#******************************************************************************        
        
@app.route('/dataset/getAttributes')
def getAttribute():
    try:
        Filename =  request.args.get('file')
        Training = int(request.args.get('Training'))
        Testing = int(request.args.get('Testing'))
        userID=request.args.get('userId')
        splittingData=DataSplitting()
        splittingData.process_initializer(Filename,Training,Testing,userID)
        splittingData.extracting_data()
        splittingData.attribute_validity()
        splittingData.split_data()
        splittingData.generate_json()
        splittingData.store_config()
        return json.dumps(splittingData.get_attribute_data())
    except Exception as err:
        msg= "Error while Generating attributes,'{}'".format(err)
        return Response(msg, status=500, mimetype='text/plain')

#******************************************************************************
#Filter Data According to Selected Attributes
#******************************************************************************

@app.route('/dataset/sendAttributes', methods=['POST'])    
def filter_data():
    try:
        userID=request.args.get('userId')
        input_json = request.get_json(force=True)
        filteringData=Filtering()
        filteringData.process_initializer(userID,input_json)
        filteringData.read_config()
        filteringData.get_selected_attributes()
        filteringData.filter_data()
        filteringData.generate_json()
        filteringData.store_config()
        return "Success"
    except Exception as err:  
        msg= "Error while Fitering Attributes,'{}'".format(err)
        return Response(msg, status=500, mimetype='text/plain')    
#******************************************************************************
#Training Classifier
#******************************************************************************

@app.route('/dataset/trainModel')    
def train_model():
    try:
        userID=request.args.get('userId')
        classifierName = request.args.get('classifier')
        trainModel=Training()
        trainModel.process_initializer(userID,classifierName)
        trainModel.read_config()
        trainModel.get_row_data()
        return trainModel.model_train()
    except Exception as err: 
        msg= "Error while Training Model --> {}".format(err)
        return Response(msg, status=500, mimetype='text/plain')
#******************************************************************************
#Rename Saved Model
#******************************************************************************

@app.route('/save')    
def rename_savedfile():
    try:
        userID=request.args.get('userId')
        with open(userID+'.json') as json_data:
                input_json = json.load(json_data)
        aliceName = request.args.get('modelName')
        Filename = input_json["Configuration"][0]["FileName"]
        if os.path.exists(Read_config.ModelPath+aliceName+'.sav'):
            raise Exception("File Name Already Exist")
        else:
            os.rename(Read_config.ModelPath+os.path.splitext(Filename)[0]+".sav",Read_config.ModelPath+aliceName+'.sav')
            os.remove(userID+'.json')
            os.remove(os.path.join(Read_config.FilePath,Filename))
        return "Done"    
    except Exception as err:
        msg= "Error while Saving Model , {}".format(err)
        return Response(msg, status=500, mimetype='text/plain')
#******************************************************************************
#predicting
#******************************************************************************

@app.route('/dsw/predict', methods=['POST'])   
def predict_result():
    try:
        modelName = request.args.get('modelName')
        input_json_sample = request.get_json(force=True)  
        predictData=input_json_sample['rowData']
        classificationData=input_json_sample['Classification']
        precisionData=input_json_sample['Precision']
        try:
            saved_model = pickle.load(open(Read_config.ModelPath+modelName+".sav", 'rb'))
        except Exception: 
            raise Exception("Error 4")
        prediction=saved_model.predict([predictData])
        percissionTrue=precisionData[classificationData.index(prediction[0])]*100
        precissionFalse=100-percissionTrue
        return json.dumps({"Result": str(prediction[0]),"precision_true":percissionTrue,"precision_false":precissionFalse})
        
    except Exception as err: 
        msg= "Error while Predicting Result '{}'".format(err)
        return Response(msg, status=500, mimetype='text/plain')
###############################################################################
#Main
###############################################################################

if __name__ == '__main__':
    configuration = Configuration()
    # Configuring Proxies
    configuration.proxies()
    # Strating Server
    app.run('0.0.0.0',1312)
