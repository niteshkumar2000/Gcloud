import pytest
import sys
import json
import os

arguments = sys.argv

#####Parse Arguments
test_suite = None
endpoint = None
roll_number = None
for i in range(1,arguments.__len__()):
    if(arguments[i]=='-t'):
        test_suite = arguments[i+1]
    if(arguments[i]== '-e'):
        endpoint = arguments[i+1]
    if(arguments[i]=='-r'):
        roll_number = arguments[i+1]
######################
os.environ['ROLL_NUM']=str(roll_number)
#update arguments to config
test_config_data = json.load(open('Test/testconfig.json'))
test_config_data['API_SERVER_URL']=endpoint
json.dump(test_config_data , open('Test/testconfig.json','w+'))
if(test_suite in ['sanity','milestone1']):
    pytest.main([test_config_data[test_suite] , '-s' , '-v'])
elif(test_suite == 'milestone3'):
    pytest.main([test_config_data['milestone1'] , '-s' , '-v'])
    pytest.main([test_config_data['milestone3'] , '-s' , '-v'])
else:
    print("Unsupported test")

