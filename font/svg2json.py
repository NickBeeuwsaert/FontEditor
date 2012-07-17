#!/usr/bin/env python

from xml.dom.minidom import parse
import sys, os, json
#def xml.dom.minidom.Node.getAttribute2(self,name, default=""):
#    if self.hasAttribute(name):
#        return self.getAttribute(name);
#:    return default
if __name__ == "__main__":
    if len(sys.argv)<2:
        print("Hey! I need a SVG file to parse!");
        print("Like so:\n\t"+sys.argv[0]+" myfile.svg");
        sys.exit(1);
    if os.path.exists(sys.argv[1]) == False:
        print( ("The file \"%s\" doesn't exist!"%sys.argv[1]));
        sys.exit(2);
    dom = parse(sys.argv[1]);
    defs = dom.getElementsByTagName("defs");
    dict = {}
    for d in defs:
        child = d.firstChild
        while child:
            if child.nodeType == 1 and child.tagName == "font":
                gData = {}
                glyphs = child.getElementsByTagName("glyph");
                for glyph in glyphs:
                    unicode = glyph.getAttribute("unicode");
                    gData[unicode] = {};
                    gData[unicode]["data"] = glyph.getAttribute("d");
                    gData[unicode]["horiz"] = glyph.getAttribute("horiz-adv-x");
                fam = child.getElementsByTagName("font-face")[0];
                dict[fam.getAttribute("font-family")] = {"glyphs":gData,"ascent":fam.getAttribute("ascent"), "descent": fam.getAttribute("descent"), "units-per-em": fam.getAttribute("units-per-em")};
            child = child.nextSibling
    print json.dumps(dict, sort_keys = True, indent = 4);
