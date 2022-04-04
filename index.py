from selenium import webdriver
 
# create webdriver object
driver = webdriver.Chrome()  
 
# enter keyword to search
keyword = "geeksforgeeks"
 
# get geeksforgeeks.org
driver.get("https://www.geeksforgeeks.org/")
 
# get element
driver.switch_to_frame("a-zf4xydej67gm")
inputElement = driver.find_element_by_id("email")
driver.find_element_by_css_selector("input").click()
 
# print complete element
print(element)