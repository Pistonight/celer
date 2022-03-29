/* eslint @typescript-eslint/no-loss-of-precision: 0 */
// Korok::ID
// 900 koroks
import { MapOf } from "data/util";
import { StringParser, StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

export enum KorokType {
    Acorn = "Acorn",
    AcornFlying = "Acorn Flying",
    AcornLog = "Acorn in Log",
    AcornTree = "Acorn in Tree",
    AcornHanging = "Acorn Hanging",
    Balloon = "Balloon",
    Basketball = "Basketball",
    Beard = "Horse Beard",
    BlockPuzzle = "Block Puzzle",
    BoulderCircle = "Boulder Circle",
	BoulderGolf = "Boulder Golf",
	Confetti = "Confetti",
	FlowerChase = "Flower Chase",
	FlowerCount = "Flower Count",
    IceBlock = "Ice Block",
    JumpFence = "Jump Fence",
    LiftRock = "Lift Rock",
    LiftRockDoor = "Rock under Door",
    LiftRockTree = "Rock in Tree",
    LiftRockRubble = "Rock behind Rubble",
    LiftRockBoulder = "Rock under Boulder",
    LiftRockLeaves = "Rock under Leaves",
    LiftRockSlab = "Rock under Slab",
    LightChase = "Light Chase",
    LilyPads = "Lily Pads",
    LuminousStone = "Luminous Stone",
    MatchTree = "Match Tree",
    MatchCactus = "Match Cactus",
    MetalBoxCircle = "Metal Box Circle",  
    OfferApple = "Offer Apple",
    OfferBanana = "Offer Banana",
    OfferDurian = "Offer Durian",
    OfferEgg = "Offer Egg",
    OfferPalmFruit = "Offer Palm Fruit",
    OfferPepper = "Offer Pepper",
    OfferShield = "Offer Shield",
    Race = "Race",
    RockCircle = "Rock Circle",
    ShootEmblem = "Shoot Emblem",
    SnowballGolf = "Snowball Golf",
    Torch = "Match Torch",
    TreeBranch = "Tree Branch",
    TreeStump = "Tree Stump",
    Well = "Well",
    Other = "Other"
}

class KorokModule implements CompilerPresetModule {
	private map: MapOf<() => RouteAssembly> = {};
    
	constructor(){
		this.addKorok("A01", [3075.875244140625,318.83917236328125,-3684.381103515625], KorokType.LiftRockTree);
		this.addKorok("A02", [3326.962646484375,309.8104553222656,-3589.207763671875], KorokType.RockCircle);
		this.addKorok("A03", [3455.61474609375,314.14007568359375,-3581.873779296875], KorokType.LiftRockBoulder);
		this.addKorok("A04", [3813.456787109375,255.99810791015625,-3419.22021484375], KorokType.FlowerCount);
		this.addKorok("A05", [3152.594482421875,170.16558837890625,-3328.348388671875], KorokType.Race, "", [
			[3170.78, -3317.52]
		]);
		this.addKorok("A06", [3496.162841796875,255.92831420898438,-3374.296875], KorokType.LiftRockSlab, "1 STS");
		this.addKorok("A07", [3779.70703125,275.4235534667969,-3361.519775390625], KorokType.BoulderGolf);
		this.addKorok("A08", [4422.962890625,115.15827178955078,-3340.219482421875], KorokType.LiftRockRubble);
		this.addKorok("A09", [4815.5009765625,105.73483276367188,-3300.24609375],  KorokType.LiftRockSlab, "1 STS");
		this.addKorok("A10", [3178.982421875,176.4080810546875,-3073.66650390625],  KorokType.LiftRockSlab, "1 STS");
		this.addKorok("A11", [3350.10302734375,175.02760314941406,-3079.839111328125], KorokType.LiftRockTree);
		this.addKorok("A12", [3572.84326171875,205.9109649658203,-3046.931396484375], KorokType.Balloon, "Static under hanging cliff");
		this.addKorok("A13", [3995.79931640625,292.52398681640625,-3147.580810546875], KorokType.LiftRockLeaves);
		this.addKorok("A14", [4344.05712890625,363.3880920410156,-3178.3681640625], KorokType.Race, ".dir(.E)", [
			[4252.40, -3134.47]
		]);
		this.addKorok("A15", [4428.8349609375,352.2693786621094,-3182.900146484375], KorokType.LiftRock);
		this.addKorok("A16", [4503.6591796875,379.2100524902344,-3164.38818359375], KorokType.Confetti);
		this.addKorok("A17", [4817.19775390625,106.12001037597656,-3094.217529296875], KorokType.FlowerCount, "Start top of guardian");
		this.addKorok("A18", [3736.669189453125,147.3762969970703,-2884.984130859375], KorokType.AcornLog, "Shoot midair");
		this.addKorok("A19", [4105.4541015625,233.40274047851562,-2836.7001953125], KorokType.FlowerCount);
		this.addKorok("A20", [3436.59033203125,155.19247436523438,-2533.65283203125], KorokType.BlockPuzzle);
		this.addKorok("A21", [3726.7919921875,127.29029083251953,-2677.4619140625], KorokType.LiftRock, "Side of spring");
		this.addKorok("A22", [4008.602783203125,195.20310974121094,-2736.30712890625], KorokType.LiftRockLeaves);
		this.addKorok("A23", [4396.83154296875,224.35992431640625,-2721.583984375], KorokType.RockCircle);
		this.addKorok("A24", [4508.734375,106.40349578857422,-2643.60546875], KorokType.BlockPuzzle);
		this.addKorok("A25", [3372.047607421875,271.94720458984375,-2315.193359375], KorokType.Confetti, "Top of tree");
		this.addKorok("A26", [3732.84033203125,139.54522705078125,-2423.214599609375], KorokType.BlockPuzzle);
		this.addKorok("A27", [3877.544189453125,178.84454345703125,-2371.863037109375], KorokType.LightChase);
		this.addKorok("A28", [4181.04248046875,220.8048553466797,-2540.40625], KorokType.Race, "Ordinal DEFUSE");
		this.addKorok("A29", [4338.09130859375,170.55198669433594,-2438.517578125], KorokType.Balloon, "1 BA middle");
		this.addKorok("A30", [3244.916748046875,265.8714904785156,-2000.3099365234375], KorokType.LightChase);
		this.addKorok("A31", [3479.965576171875,280.77557373046875,-2077.3408203125], KorokType.LiftRockLeaves);
		this.addKorok("A32", [3662.7841796875,273.6751708984375,-2067.315673828125], KorokType.MatchTree, "Closest tree");
		this.addKorok("A33", [4530.9453125,106.98796081542969,-2098.376220703125], KorokType.LiftRockLeaves);
		this.addKorok("A34", [4098.3173828125,232.8194580078125,-1756.4638671875], KorokType.RockCircle, "Rock in bush");
		this.addKorok("A35", [4634.4091796875,139.70751953125,-1840.945556640625], KorokType.FlowerChase);
		this.addKorok("A36", [4691.7099609375,136.71054077148438,-1777.330322265625], KorokType.BlockPuzzle);
		this.addKorok("A37", [3709.391845703125,204.17295837402344,-1683.445068359375], KorokType.LiftRock, "Top of stone structure");
		this.addKorok("A38", [4095.783203125,220.00729370117188,-1627.46435546875], KorokType.FlowerChase, "On bridge",[
			[4112.67, -1634.02],
			[4101.477178044475,-1636.5],
			[4096.728106560868,-1637],
			[4093.728692992274,-1635]
		]);
		this.addKorok("A39", [3297.69091796875,466.4747009277344,-1583.7923583984375], KorokType.LiftRockDoor);
		this.addKorok("A40", [3288.67529296875,511.29132080078125,-1574.58740234375], KorokType.LiftRockLeaves);
		this.addKorok("A41", [3237.797119140625,479.9398193359375,-1527.7459716796875], KorokType.LiftRockLeaves);
		this.addKorok("A42", [3292.11572265625,530.9024047851562,-1428.6126708984375], KorokType.LiftRock, "Next to cannons");
		this.addKorok("A43", [3296.232177734375,459.8648681640625,-1421.0872802734375], KorokType.LiftRockLeaves);
		// this.addKorok("A44", [4356.779296875,284.9696350097656,-1528.099853515625], KorokType.Race, gale()).extend({ability:{gale:1}});
		this.addKorok("A45", [3112.55224609375,426.0035095214844,-1295.3287353515625], KorokType.RockCircle);
		this.addKorok("A46", [3407.365966796875,442.7657165527344,-1278.327392578125], KorokType.LiftRockDoor);
		this.addKorok("A47", [3882.54931640625,356.5327453613281,-1340.0146484375], KorokType.OfferApple);
		this.addKorok("A48", [4104.5576171875,282.0802001953125,-1350.665283203125], KorokType.FlowerChase);
		this.addKorok("A49", [4038.209716796875,329.6244812011719,-1254.8717041015625], KorokType.MatchTree, "Right tree");
		this.addKorok("A50", [3010.15478515625,346.43121337890625,-1204.248291015625], KorokType.LiftRockSlab, "Broken column. STS MAX");
		this.addKorok("A51", [3726.3046875,331.25628662109375,-1129.71142578125], KorokType.Basketball, "GG rock throw");
		this.addKorok("A52", [3604.770263671875,334.48394775390625,-1008.6378784179688], KorokType.LiftRock, "Below bridge");
		this.addKorok("A53", [4239.3525390625,409.88409423828125,-998.2581176757812], KorokType.MatchTree, "Middle");
		this.addKorok("A54", [3960.61572265625,378.52911376953125,-858.588134765625], KorokType.Balloon, "Pre BT left of tree");
		this.addKorok("A55", [4042.2177734375,351.5685119628906,-661.9658813476562], KorokType.LiftRockBoulder);
		this.addKorok("A56", [4332.919921875,406.9634704589844,-696.6331787109375], KorokType.LightChase);
		this.addKorok("A57", [4144.2607421875,406.69757080078125,-595.9680786132812], KorokType.Confetti, "Top of tree");
		this.addKorok("C01", [-753.6708374023438,151.1773223876953,-1086.79443359375], KorokType.LiftRock);
		this.addKorok("C02", [589.7724609375,121.4820785522461,-1107.1287841796875], KorokType.BlockPuzzle);
		this.addKorok("C03", [-670.0859375,119.11569213867188,-932.680908203125], KorokType.BlockPuzzle);
		this.addKorok("C04", [178.5484619140625,134.0421905517578,-940.0205078125], KorokType.LiftRock, "In fountain");
		this.addKorok("C05", [319.6542663574219,137.19497680664062,-962.0650634765625], KorokType.AcornTree, "In tree");
		this.addKorok("C06", [506.90643310546875,141.81948852539062,-882.6182861328125], KorokType.LilyPads, "No Drown");
		this.addKorok("C07", [-941.4102783203125,133.35536193847656,-817.634033203125], KorokType.AcornFlying);
		this.addKorok("C08", [-681.3192138671875,122.38214874267578,-860.6268310546875], KorokType.OfferShield, "Leave shield");
		this.addKorok("C09", [696.309814453125,217.9962921142578,-824.385009765625], KorokType.Confetti, "Top of tree");
		this.addKorok("C10", [292.1845703125,117.2136001586914,-724.0882568359375], KorokType.Basketball, "2 Cryo blocks");
		this.addKorok("C11", [613.4127807617188,183.51446533203125,-743.378173828125], KorokType.LiftRock, "Inside hollow tree");
		this.addKorok("C12", [840.40576171875,236.288818359375,-692.4791259765625], KorokType.LiftRock, "In tree stump on peak");
		this.addKorok("C13", [1265.1778564453125,116.40611267089844,-707.25048828125], KorokType.Basketball, "Cryo block near rocks");
		this.addKorok("C14", [-935.2056884765625,167.84544372558594,-641.2413940429688], KorokType.LiftRock);
		this.addKorok("C15", [-609.5657348632812,119.00363159179688,-682.3019409179688], KorokType.LilyPads,"Cryo block");
		this.addKorok("C16", [-267.21026611328125,139.8673858642578,-610.1879272460938], KorokType.Acorn, "Under bridge");
		this.addKorok("C17", [85.54696655273438,138.13851928710938,-634.9767456054688], KorokType.LiftRockLeaves);
		this.addKorok("C18", [396.0803527832031,115.50286865234375,-625.56005859375], KorokType.LightChase);
		this.addKorok("C19", [686.0379028320312,167.934814453125,-635.10400390625], KorokType.Balloon, "Pinwheel on hollow tree");
		this.addKorok("C20", [-763.77001953125,156.0442657470703,-606.2799682617188], KorokType.LiftRockRubble);
		this.addKorok("C21", [-796.219970703125,187.667724609375,-558.8558349609375], KorokType.RockCircle);
		this.addKorok("C22", [-666.9384765625,128.60653686523438,-543.8142700195312], KorokType.RockCircle);
		this.addKorok("C23", [504.4538879394531,123.33135986328125,-493.468994140625], KorokType.AcornHanging, "Below bridge");
		this.addKorok("C24", [-1035.085205078125,150.2215118408203,-446.22222900390625], KorokType.LiftRock, "On small hill near bridge");
		this.addKorok("C25", [-803.9599609375,138.0738525390625,-403.1269836425781], KorokType.LiftRock);
		this.addKorok("C26", [-663.3020629882812,146.7740936279297,-432.6015625], KorokType.Balloon, "In tree");
		this.addKorok("C27", [-253.8292999267578,141.7269287109375,-425.72576904296875], KorokType.Race, "Aim at castle door turn");
		this.addKorok("C28", [86.23370361328125,138.81976318359375,-412.08599853515625], KorokType.LiftRockDoor);
		this.addKorok("C29", [97.63946533203125,181.01751708984375,-429.80780029296875], KorokType.Confetti, "Top of flagpole");
		this.addKorok("C30", [-886.6500244140625,129.25831604003906,-274.0400390625], KorokType.LiftRockRubble, "Next to broken house");
		this.addKorok("C31", [-548.5,140.8805389404297,-229.52001953125], KorokType.LiftRock, "On wall");
		this.addKorok("C32", [-254.35324096679688,146.84979248046875,-264.4140625], KorokType.ShootEmblem, "Castle Town Gate");
		this.addKorok("C33", [-161.75314331054688,147.43833923339844,-262.0430908203125], KorokType.Balloon, "On out wall");
		this.addKorok("C34", [623.2406005859375,123.53704833984375,-194.76898193359375], KorokType.MatchTree, "Left tree");
		this.addKorok("C35", [-239.3843994140625,139.7745361328125,-112.59457397460938], KorokType.LiftRock, "On pillar");
		this.addKorok("C36", [-1336.8880615234375,122.55142974853516,249.66232299804688], KorokType.LiftRock);
		this.addKorok("C37", [-1336.3568115234375,117.12251281738281,366.61627197265625], KorokType.BlockPuzzle);
		this.addKorok("C38", [-1155.9696044921875,137.334228515625,245.12350463867188], KorokType.FlowerChase, "", [
			[-1094.9730030478177,196],
			[-1104.9690904460522,217.5],
			[-1102.969872966405,234],
			[-1122.9620477628741,240]
		]);
		this.addKorok("C39", [-868.502197265625,187.17930603027344,219.11962890625], KorokType.Confetti, "Top of flag pole");
		this.addKorok("C40", [-728.0692138671875,154.69888305664062,134.77850341796875], KorokType.LightChase, "Same Forest");
		this.addKorok("C41", [-710.2506103515625,158.35552978515625,99.93270874023438], KorokType.AcornTree);
		this.addKorok("C42", [-516.9583129882812,154.04690551757812,97.79037475585938], KorokType.Balloon, "Shoot midair");
		this.addKorok("C43", [-427.2841491699219,135.8404998779297,150.9248046875], KorokType.AcornFlying);
		this.addKorok("C44", [25.663909912109375,148.47073364257812,147.48104858398438], KorokType.LiftRock);
		this.addKorok("C45", [384.2616882324219,154.1734619140625,135.3624267578125], KorokType.LiftRock, "On hill");
		this.addKorok("C46", [806.5718994140625,116.89136505126953,24.094940185546875], KorokType.LiftRock, "Under bridge");
		this.addKorok("C47", [-1127.2867431640625,145.96994018554688,414.31072998046875], KorokType.LilyPads, "Cryo");
		this.addKorok("C48", [-737.4061889648438,125.85944366455078,333.7564697265625], KorokType.LiftRock, "Between 2 rocks");
		this.addKorok("C49", [-363.24908447265625,131.7303924560547,396.9415588378906], KorokType.AcornHanging, "Wagon next to tree");
		this.addKorok("C50", [147.104248046875,128.3034210205078,295.7684020996094], KorokType.FlowerCount, "Chaos Ranch");
		this.addKorok("C51", [627.0390625,130.9409637451172,182.30697631835938], KorokType.BoulderCircle);
		this.addKorok("C52", [-1313.9427490234375,116.17443084716797,622.8614501953125], KorokType.LiftRock, "In well");
		this.addKorok("C53", [-1020.3829345703125,201.021240234375,559.8116455078125], KorokType.OfferApple);
		this.addKorok("C54", [-512.7506713867188,170.26956176757812,550.6234130859375], KorokType.Confetti, "Top of flagpole");
		this.addKorok("C55", [-122.0947265625,128.79473876953125,594.0033569335938], KorokType.LightChase, "Forest left of guardian");
		this.addKorok("C56", [322.06573486328125,127.50057983398438,525.0072631835938], KorokType.OfferApple);
		this.addKorok("C57", [-1249.551513671875,125.52603912353516,730.6768798828125], KorokType.AcornTree);
		this.addKorok("C58", [-1439.6009521484375,125.50503540039062,846.667724609375], KorokType.TreeStump);
		this.addKorok("C59", [-1512.6861572265625,117.38461303710938,908.665283203125], KorokType.Basketball, "Cryo block");
		this.addKorok("C60", [-1106.9395751953125,139.42178344726562,905.2623291015625], KorokType.BlockPuzzle);
		this.addKorok("C61", [-1009.4632568359375,130.1140899658203,932.0391845703125], KorokType.RockCircle);
		this.addKorok("C62", [-749.9226684570312,132.9081573486328,892.2105102539062], KorokType.LightChase);
		this.addKorok("C63", [-644.5822143554688,146.21067810058594,876.1129150390625], KorokType.FlowerChase);
		this.addKorok("C64", [-133.70574951171875,143.35292053222656,945.0361328125], KorokType.LightChase);
		this.addKorok("C65", [225.38177490234375,173.64730834960938,872.040283203125], KorokType.AcornTree);
		this.addKorok("C66", [-1356.6968994140625,140.95152282714844,1002.4117431640625], KorokType.RockCircle);
		this.addKorok("C67", [-1154.35888671875,132.86940002441406,964.635498046875], KorokType.LiftRock, "On ledge (Hard to see)");
		this.addKorok("C68", [-1134.464111328125,143.84771728515625,1030.472412109375], KorokType.AcornHanging, "On bridge");
		this.addKorok("C69", [-599.9459228515625,138.0255126953125,1071.8155517578125], KorokType.AcornHanging, "From tree");
		this.addKorok("C70", [-106.4598388671875,153.3300323486328,1047.96875], KorokType.RockCircle, "3");
		this.addKorok("C71", [39.26458740234375,140.77879333496094,1034.492431640625], KorokType.LiftRockTree);
		this.addKorok("C72", [-1370.34228515625,174.2264404296875,1165.82080078125], KorokType.AcornFlying, "BT");
		this.addKorok("C73", [-1190.0242919921875,174.95176696777344,1116.74462890625], KorokType.Race, "SQ High");
		this.addKorok("C74", [-1149.9171142578125,218.28738403320312,1204.1036376953125], KorokType.LiftRock, "Top of Coliseum");
		this.addKorok("C75", [-425.2748107910156,131.0,1189.34619140625], KorokType.LilyPads, "No Drown");
		this.addKorok("C76", [-466.4117736816406,137.2151336669922,1279.382080078125], KorokType.LiftRockLeaves);
		this.addKorok("C77", [295.580322265625,135.22227478027344,1204.7957763671875], KorokType.Balloon);
		this.addKorok("C78", [-1314.296630859375,139.19345092773438,1257.33544921875], KorokType.LiftRock);
		this.addKorok("C79", [-1224.689697265625,299.79888916015625,1358.41552734375], KorokType.LiftRock);
		this.addKorok("C80", [-1280.392822265625,284.6875,1384.8985595703125], KorokType.AcornLog, "Shoot midair");
		this.addKorok("C81", [-1057.3115234375,167.53245544433594,1327.524658203125], KorokType.LightChase, "In ruins");
		this.addKorok("C82", [-770.0293579101562,135.0662078857422,1380.977294921875], KorokType.LightChase);
		this.addKorok("C83", [-653.6451416015625,159.13711547851562,1390.289794921875], KorokType.Balloon, "Rotate to the left");
		this.addKorok("C84", [69.30227661132812,121.17214965820312,1438.00048828125], KorokType.AcornFlying, "Shoot hard one in non BT");
		this.addKorok("C85", [-1666.6614990234375,249.2756805419922,1393.9600830078125], KorokType.LiftRockTree);
		this.addKorok("C86", [-1728.5853271484375,144.3968963623047,1478.8642578125], KorokType.LiftRock);
		this.addKorok("C87", [-1583.9307861328125,68.69306945800781,1579.6907958984375], KorokType.Basketball);
		this.addKorok("C88", [-1746.9169921875,71.0,1831.09716796875], KorokType.LilyPads, "Cryo Block");
		this.addKorok("C89", [-1491.5311279296875,68.4985580444336,1832.245361328125], KorokType.Basketball, "GG throw");
		this.addKorok("D01", [954.4029541015625,116.27892303466797,942.4681396484375], KorokType.LiftRock, "Island below");
		this.addKorok("D02", [1775.8023681640625,219.04698181152344,963.6041259765625], KorokType.LilyPads, "Impa house. Cryo");
		this.addKorok("D03", [1807.03173828125,220.4456024169922,992.2015380859375], KorokType.OfferApple);
		this.addKorok("D04", [1793.899658203125,258.8985595703125,1052.8245849609375], KorokType.LiftRock, "Ledge");
		this.addKorok("D05", [1798.3336181640625,230.967041015625,1078.175048828125], KorokType.ShootEmblem);
		this.addKorok("D06", [1957.252685546875,248.06983947753906,1062.054443359375], KorokType.ShootEmblem);
		this.addKorok("D07", [2163.896240234375,460.6209411621094,1034.737060546875], KorokType.LiftRock, "2nd Peak");
		this.addKorok("D08", [1939.513916015625,269.11077880859375,1110.931396484375], KorokType.LiftRock, "On ledge");
		this.addKorok("D09", [1676.1005859375,324.6341857910156,1157.939453125], KorokType.MatchTree, "Closest to peak");
		this.addKorok("D10", [1739.307373046875,413.3752136230469,1186.6749267578125], KorokType.LiftRock, "2nd Peak");
		this.addKorok("D11", [1933.25634765625,376.7372131347656,1220.9644775390625], KorokType.LiftRock, "Peak");
		this.addKorok("D12", [2058.504638671875,244.81300354003906,1208.554443359375], KorokType.BlockPuzzle);
		this.addKorok("D13", [516.1041870117188,127.02505493164062,1167.1026611328125], KorokType.LiftRockTree, "3rd big tree N of open rock");
		this.addKorok("D14", [337.14971923828125,120.05060577392578,1271.0618896484375], KorokType.AcornHanging, "From bridge");
		this.addKorok("D15", [715.1109619140625,166.34841918945312,1327.0263671875], KorokType.TreeStump, "Edge of forest");
		this.addKorok("D16", [1040.5545654296875,121.3508071899414,1318.1534423828125], KorokType.LiftRock, "Small island");
		this.addKorok("D17", [1293.4417724609375,273.6983337402344,1331.3609619140625], KorokType.LiftRockTree);
		this.addKorok("D18", [1553.5408935546875,119.0,1297.18701171875], KorokType.LilyPads, "No Drown");
		this.addKorok("D19", [1638.969482421875,116.47470092773438,1376.28955078125], KorokType.Basketball, "no GG");
		this.addKorok("D20", [1750.4300537109375,116.39288330078125,1544.6895751953125], KorokType.Basketball, "GG a rock down");
		this.addKorok("D21", [2207.28515625,192.59722900390625,1373.4803466796875], KorokType.Confetti, "Top of tree");
		this.addKorok("D22", [318.1566162109375,115.3873062133789,1397.90234375], KorokType.LiftRockBoulder);
		this.addKorok("D23", [518.626953125,131.00050354003906,1475.525390625], KorokType.AcornFlying);
		this.addKorok("D24", [668.6470336914062,135.4751434326172,1468.2978515625], KorokType.BoulderGolf, "Surf down after bomb");
		this.addKorok("D25", [788.8381958007812,145.8728790283203,1471.3544921875], KorokType.JumpFence, "Summon Horse");
		this.addKorok("D26", [87.01260375976562,164.5443115234375,1585.0992431640625], KorokType.Confetti, "Top of flagpole");
		this.addKorok("D27", [232.20809936523438,115.35430145263672,1601.4176025390625], KorokType.LiftRock, "Under bridge");
		this.addKorok("D28", [671.0919799804688,180.866455078125,1638.3790283203125], KorokType.Confetti, "Top of flagpole");
		this.addKorok("D29", [850.5078125,115.39984893798828,1623.99267578125], KorokType.LiftRock, "On island");
		this.addKorok("D30", [1376.52587890625,327.8503723144531,1680.3431396484375], KorokType.OfferApple);
		this.addKorok("D31", [54.9873046875,146.90780639648438,1758.557861328125], KorokType.BoulderGolf);
		this.addKorok("D32", [112.3134765625,116.67420959472656,1709.782470703125], KorokType.Basketball, "GG throw p close");
		this.addKorok("D33", [178.96127319335938,116.68154907226562,1719.983154296875], KorokType.BlockPuzzle);
		this.addKorok("D34", [225.30072021484375,121.99018859863281,1705.6627197265625], KorokType.LiftRock);
		this.addKorok("D35", [312.68017578125,180.271728515625,1766.796875], KorokType.Balloon);
		this.addKorok("D36", [516.7669677734375,167.24465942382812,1788.1689453125], KorokType.FlowerChase);
		this.addKorok("D37", [644.188720703125,116.81539916992188,1763.264404296875], KorokType.BoulderGolf);
		this.addKorok("D38", [704.986572265625,116.75592803955078,1796.5673828125], KorokType.LiftRock, "In cave");
		this.addKorok("D39", [1049.2388916015625,115.87366485595703,1783.27734375], KorokType.FlowerChase, "Across River");
		this.addKorok("D40", [1258.45947265625,492.116455078125,1851.126953125], KorokType.LiftRock);
		this.addKorok("D41", [1517.2716064453125,400.2469482421875,1850.083251953125], KorokType.BoulderGolf);
		this.addKorok("D42", [1748.5718994140625,140.69378662109375,1921.65283203125], KorokType.Confetti, "Top of stable");
		this.addKorok("D43", [-190.9500732421875,121.68447875976562,1831.53955078125], KorokType.FlowerCount, "In cave");
		this.addKorok("D44", [5.3216552734375,207.82366943359375,1897.896240234375], KorokType.LiftRock);
		this.addKorok("D45", [160.04425048828125,150.43666076660156,1942.172119140625], KorokType.Confetti);
		this.addKorok("D46", [551.5767211914062,182.90003967285156,1903.506591796875], KorokType.MatchTree, "Right tree");
		this.addKorok("D47", [868.2728881835938,142.61622619628906,1902.033447265625], KorokType.Balloon);
		this.addKorok("D48", [1101.693115234375,224.28668212890625,1889.5396728515625], KorokType.LiftRock, "Upper level");
		this.addKorok("D49", [1245.110595703125,541.3435668945312,1942.177978515625], KorokType.OfferApple);
		this.addKorok("D50", [815.2213134765625,202.72964477539062,2089.437744140625], KorokType.LiftRockSlab);
		this.addKorok("D51", [1877.425048828125,132.53369140625,2051.32421875], KorokType.LiftRockTree, "Big tree");
		this.addKorok("D52", [2054.829345703125,153.24330139160156,2092.72998046875], KorokType.Balloon);
		this.addKorok("D53", [2484.829833984375,119.0,2103.39306640625], KorokType.LilyPads, "Put cryo");
		this.addKorok("D54", [-115.48483276367188,186.8434600830078,2303.39208984375], KorokType.Torch);
		this.addKorok("D55", [1682.656982421875,201.46978759765625,2327.618896484375], KorokType.LiftRock, "On ledge high");
		this.addKorok("D56", [1886.1842041015625,147.40780639648438,2418.735107421875], KorokType.LiftRock, KorokType.TreeStump);
		this.addKorok("D57", [2303.51025390625,281.29998779296875,2375.134521484375], KorokType.LilyPads, "No Drown");
		this.addKorok("D58", [2366.560302734375,221.70481872558594,2303.498779296875], KorokType.AcornFlying, "Bomb Arrow");
		this.addKorok("D59", [1936.54052734375,134.27088928222656,2564.50146484375], KorokType.LiftRock, "Bottom of waterfall");
		this.addKorok("E01", [1615.10498046875,207.95501708984375,-3661.0302734375], KorokType.LiftRockLeaves);
		this.addKorok("E02", [2087.11474609375,318.2576599121094,-3573.555908203125], KorokType.BlockPuzzle);
		this.addKorok("E03", [2233.992431640625,338.4425964355469,-3673.52490234375], KorokType.LiftRockRubble);
		this.addKorok("E04", [2551.0615234375,411.23773193359375,-3592.6767578125], KorokType.LiftRockRubble);
		this.addKorok("E05", [2662.63232421875,479.3359069824219,-3471.58544921875], KorokType.RockCircle, "Pillars around shrine");
		this.addKorok("E06", [2469.91259765625,514.7254638671875,-3174.502685546875], KorokType.LiftRockRubble);
		this.addKorok("E07", [1549.113037109375,533.4021606445312,-3108.548828125], KorokType.LiftRock, "Top of island");
		this.addKorok("E08", [1632.0169677734375,585.5542602539062,-2939.500244140625], KorokType.LiftRock, "Top of northern mine");
		this.addKorok("E09", [2195.503173828125,613.2101440429688,-3007.84130859375], KorokType.LiftRock, "On hanging rock high");
		this.addKorok("E10", [1885.78369140625,513.931884765625,-2749.10595703125], KorokType.Balloon);
		this.addKorok("E11", [2060.9775390625,580.31396484375,-2757.419921875], KorokType.RockCircle);
		this.addKorok("E12", [3322.9443359375,379.4629211425781,-2803.064453125], KorokType.BlockPuzzle);
		this.addKorok("E13", [1658.130126953125,554.5892944335938,-2564.87451171875], KorokType.LiftRock);
		this.addKorok("E14", [1725.3494873046875,607.0525512695312,-2553.939453125], KorokType.Race, "SQ", [
			[1610.18, -2544.72]
		]);
		this.addKorok("E15", [1593.87939453125,543.9135131835938,-2475.24951171875], KorokType.Confetti, "Inside agreeGe");
		this.addKorok("E16", [1865.5545654296875,533.9346923828125,-2465.0439453125], KorokType.Confetti, "Top of skeleton");
		this.addKorok("E17", [1867.8145751953125,511.0074768066406,-2400.638427734375], KorokType.Race, "Glide over", [
			[1915.68, -2382.10]
		]);
		this.addKorok("E18", [1647.2315673828125,521.044677734375,-2244.460693359375], KorokType.RockCircle, "GG over");
		this.addKorok("E19", [1537.8502197265625,505.3825378417969,-2091.503173828125], KorokType.Balloon,"High up");
		this.addKorok("E20", [2019.416015625,557.7247314453125,-2172.8994140625], KorokType.BoulderGolf, "Can go after bomb");
		this.addKorok("E21", [2170.73828125,547.0383911132812,-2109.5546875], KorokType.BlockPuzzle);
		this.addKorok("E22", [2355.876220703125,524.6515502929688,-2067.376220703125], KorokType.LiftRock, "On stone above ring");
		this.addKorok("E23", [2663.897216796875,564.4959716796875,-2066.873046875], KorokType.LiftRockRubble);
		this.addKorok("E24", [1412.0240478515625,408.74725341796875,-1759.8046875], KorokType.BoulderGolf, "WB away after");
		this.addKorok("E25", [1544.3309326171875,394.2030029296875,-1837.214111328125], KorokType.Race, "Glide and run", [
			[1526.8999157068229,-1890]
		]);
		this.addKorok("E26", [1687.5562744140625,427.39501953125,-1717.0870361328125], KorokType.BoulderGolf, "Bomb down");
		this.addKorok("E27", [1950.8543701171875,457.4908142089844,-1832.657470703125], KorokType.LiftRockRubble);
		this.addKorok("E28", [2273.79931640625,431.7688293457031,-1823.224609375], KorokType.Balloon, "Aim Above");
		this.addKorok("E29", [2424.331298828125,253.68734741210938,-1738.5003662109375], KorokType.Basketball);
		this.addKorok("E30", [2703.711181640625,225.5242156982422,-1749.2708740234375], KorokType.BlockPuzzle);
		this.addKorok("E31", [1426.8953857421875,465.03790283203125,-1544.06982421875], KorokType.RockCircle, "2 rocks");
		this.addKorok("E32", [2266.5556640625,347.37762451171875,-1565.48583984375], KorokType.LiftRockRubble);
		this.addKorok("E33", [2407.270751953125,328.66650390625,-1613.595703125], KorokType.Race, ".dir(N>) Turn");
		this.addKorok("E34", [2751.066650390625,293.7672424316406,-1675.907958984375], KorokType.RockCircle);
		this.addKorok("E35", [1377.2037353515625,322.40667724609375,-1261.174072265625], KorokType.RockCircle);
		this.addKorok("E36", [1940.1495361328125,226.01260375976562,-1217.73193359375], KorokType.LilyPads, "No Drown");
		this.addKorok("E37", [2179.551025390625,226.3402099609375,-1282.0350341796875], KorokType.RockCircle);
		this.addKorok("E38", [2478.572998046875,313.41949462890625,-1391.5916748046875], KorokType.BlockPuzzle);
		this.addKorok("E39", [2752.29443359375,233.72796630859375,-1366.33642578125], KorokType.Basketball, "GG throw");
		this.addKorok("E40", [2504.4755859375,312.20562744140625,-1304.2838134765625], KorokType.LiftRockRubble);
		this.addKorok("E41", [2408.1953125,262.343994140625,-1229.951171875], KorokType.Balloon, "Shoot from E42");
		this.addKorok("E42", [2441.137451171875,257.4069519042969,-1241.7298583984375], KorokType.LiftRock, "Ledge below stone thing");
		this.addKorok("E43", [2315.02734375,293.5242004394531,-1133.2568359375], KorokType.LiftRockRubble);
		this.addKorok("E44", [2655.78857421875,261.7460021972656,-971.171142578125], KorokType.LiftRock, "Left set of trees");
		this.addKorok("E45", [2275.005615234375,134.98202514648438,-720.1478271484375], KorokType.Race, "ordinal DEFUSE");
		this.addKorok("F01", [1381.903564453125,288.3027038574219,2277.44775390625], KorokType.AcornTree);
		this.addKorok("F02", [1188.6400146484375,323.43194580078125,2476.7099609375], KorokType.Race, ".dir(<S) Turn");
		this.addKorok("F03", [1305.289306640625,191.34896850585938,2434.05859375], KorokType.Balloon);
		this.addKorok("F04", [1323.7225341796875,194.40219116210938,2453.451904296875], KorokType.RockCircle, "Use tree");
		this.addKorok("F05", [1462.6767578125,336.7975158691406,2370.848876953125], KorokType.Balloon);
		this.addKorok("F06", [2181.72705078125,414.98114013671875,2534.69580078125], KorokType.LiftRock, "Peak");
		this.addKorok("F07", [2403.8310546875,256.6015319824219,2511.222412109375], KorokType.LightChase);
		this.addKorok("F08", [1966.6295166015625,365.96295166015625,2634.478515625], KorokType.LiftRockTree);
		this.addKorok("F09", [2099.720947265625,363.66046142578125,2625.572265625], KorokType.Basketball, "2 STS hits");
		this.addKorok("F10", [1373.0001220703125,220.29400634765625,2749.046142578125], KorokType.FlowerChase, "In cave");
		this.addKorok("F11", [1936.5281982421875,492.9896240234375,2778.5439453125], KorokType.LiftRock, "Peak");
		this.addKorok("F12", [2103.915283203125,422.5005187988281,2726.0986328125], KorokType.FlowerChase, "", [
			[2042.4013992433693,2660.5],
			[2053.8961858700295,2705.5],
			[2092.8785057343575,2692],
			[2115.368305656086,2711],
			[2102.8739723662366,2725.5]
		]);
		this.addKorok("F13", [2284.272705078125,287.53778076171875,2659.9716796875], KorokType.LiftRock, "Under tree");
		this.addKorok("F14", [2874.914794921875,299.739990234375,2683.368408203125], KorokType.LilyPads, "No Drown");
		this.addKorok("F15", [1325.560791015625,296.66778564453125,3008.677734375], KorokType.LightChase);
		//this.addKorok("F16", [1562.5604248046875,298.620849609375,2898.3173828125], KorokType.Race, gale()).extend({ability:{gale: 1}});
		this.addKorok("F17", [1773.844482421875,346.6876220703125,2930.866943359375], KorokType.Well, "(Mag boulder in stone)");
		this.addKorok("F18", [3084.93115234375,239.77711486816406,2884.64892578125], KorokType.LiftRockRubble, "In cave");
		this.addKorok("F19", [1785.5367431640625,344.3603210449219,3011.0703125], KorokType.Race, "Swim up");
		this.addKorok("F20", [1943.7462158203125,348.58984375,3009.421630859375], KorokType.MatchTree, "Closest");
		this.addKorok("F21", [2294.480224609375,287.5065002441406,3028.1708984375], KorokType.OfferApple);
		this.addKorok("F22", [2951.34130859375,246.57861328125,3005.961669921875], KorokType.FlowerChase, "Round trip");
		this.addKorok("F23", [1012.0673828125,127.12100982666016,3258.183349609375], KorokType.FlowerChase);
		this.addKorok("F24", [1055.1160888671875,167.1360626220703,3254.7705078125], KorokType.Balloon, "Shoot from bridge");
		this.addKorok("F25", [1406.7125244140625,255.48915100097656,3198.7548828125], KorokType.OfferDurian);
		this.addKorok("F26", [1660.1514892578125,252.65347290039062,3163.641845703125], KorokType.BlockPuzzle, "Middle of waterfall");
		this.addKorok("F27", [1799.42041015625,224.83380126953125,3157.65478515625], KorokType.LiftRock, "Ledge");
		//this.addKorok("F28", [1803.734375,202.60110473632812,3221.99560546875], KorokType.FlowerChase, gale()).extend({ability:{gale: 1}});
		this.addKorok("F29", [2032.2818603515625,292.1425476074219,3164.34521484375], KorokType.BlockPuzzle, "Piece in lake, cryo");
		this.addKorok("F30", [2171.2109375,198.86778259277344,3276.906982421875], KorokType.MatchTree, "West tree");
		this.addKorok("F31", [2636.233154296875,191.58714294433594,3197.798828125], KorokType.LiftRockLeaves);
		this.addKorok("F32", [3175.442626953125,309.28900146484375,3204.02978515625], KorokType.LightChase);
		this.addKorok("F33", [3639.7744140625,326.91180419921875,3258.22412109375], KorokType.LiftRock, "On ledge");
		this.addKorok("F34", [1492.117431640625,188.12911987304688,3370.484619140625], KorokType.Balloon, "3");
		this.addKorok("F35", [1857.4305419921875,176.84051513671875,3351.671630859375], KorokType.LuminousStone, "Eye of statue");
		this.addKorok("F36", [2968.71875,122.93293762207031,3380.182373046875], KorokType.RockCircle, "STS tree");
		this.addKorok("F37", [3289.577392578125,175.8000030517578,3338.792724609375], KorokType.LilyPads, "No Drown");
		this.addKorok("F38", [1217.3858642578125,135.04061889648438,3524.105224609375], KorokType.LiftRock);
		this.addKorok("F39", [1378.0985107421875,256.94000244140625,3503.561279296875], KorokType.OfferDurian);
		this.addKorok("F40", [1449.4744873046875,222.69558715820312,3531.367919921875], KorokType.LiftRock, "middle of mud");
		this.addKorok("F41", [1552.487060546875,182.81076049804688,3529.2412109375], KorokType.Beard);
		this.addKorok("F42", [1733.1610107421875,168.0592803955078,3450.58935546875], KorokType.Balloon, "Middle of bridge");
		this.addKorok("F43", [2139.9814453125,200.28390502929688,3531.93994140625], KorokType.RockCircle);
		this.addKorok("F44", [2836.962158203125,126.87939453125,3452.762939453125], KorokType.OfferApple, "Bomb top of palm tree");
		this.addKorok("F45", [2939.43212890625,122.43041229248047,3427.086181640625], KorokType.FlowerChase, "Top of house");
		this.addKorok("F46", [1840.6885986328125,135.0218048095703,3595.8271484375], KorokType.BlockPuzzle);
		this.addKorok("F47", [2559.240966796875,344.0076599121094,3602.712158203125], KorokType.LiftRock, "Peak");
		this.addKorok("F48", [1757.8018798828125,253.70486450195312,3685.9775390625], KorokType.OfferBanana, "banana next to it");
		this.addKorok("F49", [2856.582763671875,113.69996643066406,3651.770263671875], KorokType.RockCircle);
		this.addKorok("F50", [3024.4052734375,107.61489868164062,3654.227294921875], KorokType.FlowerChase, "Turn around after beach");
		this.addKorok("F51", [3367.1083984375,109.90001678466797,3653.537109375], KorokType.LilyPads);
		this.addKorok("F52", [3796.61376953125,106.2935562133789,3618.89501953125], KorokType.LiftRock);
		this.addKorok("F53", [1374.62060546875,107.24613189697266,3751.463623046875], KorokType.RockCircle);
		this.addKorok("F54", [1513.7421875,136.27101135253906,3725.036865234375], KorokType.LiftRock, "Ledge beach level");
		this.addKorok("F55", [1821.037353515625,272.0273742675781,3742.025634765625], KorokType.LiftRock, "Upper ledge");
		this.addKorok("F56", [1625.4940185546875,143.74700927734375,3891.732421875], KorokType.Balloon, "Under cliff");
		this.addKorok("F57", [2508.150146484375,157.62130737304688,3825.909423828125], KorokType.RockCircle, "Heart");
		this.addKorok("F58", [3170.41552734375,109.88542175292969,3824.316162109375], KorokType.LilyPads, "Close to beach rocks");
		this.addKorok("G01", [-4409.10302734375,618.9225463867188,331.34173583984375], KorokType.BoulderGolf, "Bomb down STS hit in");
		this.addKorok("G02", [-4183.67529296875,491.7544860839844,291.0669250488281], KorokType.Race, "Run");
		this.addKorok("G03", [-4066.78662109375,569.1417846679688,437.8475036621094], KorokType.RockCircle);
		this.addKorok("G04", [-4355.3369140625,716.5999755859375,709.8740234375], KorokType.BlockPuzzle);
		this.addKorok("G05", [-4325.40869140625,768.4448852539062,698.2925415039062], KorokType.Race, ".dir(S>)");
		this.addKorok("G06", [-3673.785888671875,550.7922973632812,698.3046875], KorokType.LiftRock, "On wood platform");
		this.addKorok("G07", [-4690.48828125,704.14453125,842.3634643554688], KorokType.IceBlock, "2 Fire Arrows");
		//this.addKorok("G08", [-4340.95361328125,767.3850708007812,782.1328735351562], KorokType.FlowerChase, gale()).extend({ability:{gale:1}});
		this.addKorok("G09", [-3688.84765625,740.4762573242188,798.7249755859375], KorokType.RockCircle);
		this.addKorok("G10", [-3069.678466796875,452.02679443359375,910.748779296875], KorokType.RockCircle);
		this.addKorok("G11", [-4210.02490234375,609.7234497070312,1133.5091552734375], KorokType.Race, ".dir<E");
		this.addKorok("G12", [-3224.51904296875,570.7603149414062,1022.4508666992188], KorokType.BlockPuzzle);
		this.addKorok("G13", [-2867.817626953125,518.5404052734375,1124.926513671875], KorokType.Confetti, "Top of tree");
		this.addKorok("G14", [-2454.27294921875,337.8280029296875,1157.3052978515625], KorokType.Balloon);
		this.addKorok("G15", [-4552.23828125,623.394287109375,1353.159423828125], KorokType.LiftRock);
		this.addKorok("G16", [-4112.89453125,560.6600952148438,1377.535400390625], KorokType.LightChase,);
		this.addKorok("G17", [-3065.60009765625,604.4939575195312,1287.266845703125], KorokType.IceBlock);
		this.addKorok("G18", [-2850.0,678.325927734375,1229.0], KorokType.IceBlock, "Far one");
		this.addKorok("G19", [-2521.76220703125,457.0562744140625,1318.5899658203125], KorokType.RockCircle);
		this.addKorok("G20", [-4527.8359375,571.973876953125,1423.3245849609375], KorokType.RockCircle);
		this.addKorok("G21", [-4180.767578125,440.3622131347656,1482.393798828125], KorokType.BlockPuzzle);
		this.addKorok("G22", [-3129.01416015625,614.0128784179688,1467.154541015625], KorokType.RockCircle);
		this.addKorok("G23", [-2646.004638671875,688.3248901367188,1535.134765625], KorokType.LiftRock, "Peak far");
		this.addKorok("G24", [-2081.09033203125,353.6358337402344,1477.028564453125], KorokType.RockCircle);
		this.addKorok("G25", [-4075.583984375,298.89251708984375,1595.131591796875], KorokType.OfferBanana, "Pick up 3");
		this.addKorok("G26", [-3715.859130859375,570.3721923828125,1558.0728759765625], KorokType.SnowballGolf, "Carry halfway");
		this.addKorok("G27", [-2817.46484375,578.2276611328125,1652.72119140625], KorokType.RockCircle, "Platform on cliff");
		this.addKorok("G28", [-2464.743408203125,417.7117919921875,1713.4754638671875], KorokType.BlockPuzzle);
		this.addKorok("G29", [-1799.60693359375,114.89266967773438,1625.9010009765625], KorokType.BlockPuzzle);
		this.addKorok("G30", [-4136.3955078125,401.44708251953125,1717.959716796875], KorokType.RockCircle);
		this.addKorok("G31", [-3845.2353515625,412.2644958496094,1897.0517578125], KorokType.Balloon, "Wait in BT");
		this.addKorok("G32", [-2429.13720703125,203.48768615722656,1921.3358154296875], KorokType.Race, "Run");
		this.addKorok("G33", [-4170.68212890625,193.1843719482422,1989.3846435546875], KorokType.RockCircle);
		this.addKorok("G34", [-3071.388427734375,197.78855895996094,2044.7327880859375], KorokType.BlockPuzzle, "Bottom right");
		this.addKorok("G35", [-2697.262939453125,270.84326171875,2105.0615234375], KorokType.Race, "SQ DEFUSE");
		this.addKorok("G36", [-1721.2257080078125,143.19186401367188,2237.78076171875], KorokType.Well);
		this.addKorok("H01", [-4397.6064453125,332.44537353515625,-3773.916748046875], KorokType.BlockPuzzle);
		this.addKorok("H02", [-4029.338623046875,464.85235595703125,-3760.17919921875], KorokType.IceBlock, "Left one");
		this.addKorok("H03", [-3960.375732421875,350.6724548339844,-3723.257568359375], KorokType.FlowerChase);
		this.addKorok("H04", [-3757.12744140625,375.4654846191406,-3848.0830078125], KorokType.RockCircle, "Rock behind camp");
		this.addKorok("H05", [-1970.932373046875,420.711669921875,-3792.56884765625], KorokType.Balloon, "Bomb Arrow (Turn around)");
		this.addKorok("H06", [-1375.1732177734375,361.9268493652344,-3640.94287109375], KorokType.RockCircle);
		this.addKorok("H07", [-4167.162109375,516.820068359375,-3615.93701171875], KorokType.Race, "Surf down FAST");
		this.addKorok("H08", [-3999.2158203125,632.9622192382812,-3620.060302734375], KorokType.Balloon, "SBR");
		this.addKorok("H09", [-3496.125244140625,474.2198486328125,-3580.674072265625], KorokType.LiftRockLeaves);
		this.addKorok("H10", [-3610.6494140625,561.9242553710938,-3491.990478515625], KorokType.AcornLog, "Farthest set of trees");
		this.addKorok("H11", [-3414.794189453125,542.0234375,-3509.61083984375], KorokType.Confetti, "Top of bare tree");
		this.addKorok("H12", [-2842.695556640625,333.93890380859375,-3493.488037109375], KorokType.RockCircle);
		this.addKorok("H13", [-2290.10791015625,564.25830078125,-3407.5966796875], KorokType.IceBlock, "3 FA");
		this.addKorok("H14", [-1535.295166015625,346.8846130371094,-3475.819091796875], KorokType.AcornLog);
		this.addKorok("H15", [-1095.98583984375,413.9732971191406,-3399.872802734375], KorokType.BlockPuzzle);
		this.addKorok("H16", [-872.8972778320312,335.5024719238281,-3316.105712890625], KorokType.Balloon, "Bomb tree");
		this.addKorok("H17", [-4155.93701171875,350.44818115234375,-3404.128173828125], KorokType.RockCircle, "Snowy Platform");
		this.addKorok("H18", [-3843.155029296875,435.3878479003906,-3348.181640625], KorokType.Confetti, "Forest with 5 trees");
		this.addKorok("H19", [-3574.575439453125,494.23028564453125,-3272.38232421875], KorokType.Balloon, "First Forest on right");
		this.addKorok("H20", [-2946.503173828125,686.9846801757812,-3146.699462890625], KorokType.Confetti, "Top of house");
		this.addKorok("H21", [-2602.174560546875,508.3544616699219,-3238.930908203125], KorokType.Confetti, "Top of tree");
		this.addKorok("H22", [-1110.79833984375,438.0611572265625,-3043.856201171875], KorokType.BoulderGolf, "WB away after");
		this.addKorok("H23", [-4424.15478515625,497.164794921875,-3215.942138671875], KorokType.LiftRock, "Peak far");
		this.addKorok("H24", [-4230.89306640625,284.85693359375,-3134.811279296875], KorokType.FlowerChase, "Below high forest");
		this.addKorok("H25", [-3793.739501953125,353.0625305175781,-3032.966552734375], KorokType.LiftRock, "In corner");
		this.addKorok("H26", [-3734.781982421875,446.5874328613281,-2964.3984375], KorokType.LiftRock);
		this.addKorok("H27", [-3350.52978515625,621.9530029296875,-2994.894775390625], KorokType.Balloon);
		this.addKorok("H28", [-2783.55224609375,838.535400390625,-2895.524658203125], KorokType.LiftRock);
		this.addKorok("H29", [-2487.656005859375,514.3343505859375,-3021.6005859375], KorokType.IceBlock, "3-4 FA");
		this.addKorok("H30", [-2250.21484375,446.8034973144531,-3092.182861328125], KorokType.AcornFlying);
		this.addKorok("H31", [-2210.059814453125,498.6493225097656,-2908.5439453125], KorokType.IceBlock, "2 FA");
		this.addKorok("H32", [-4402.5546875,415.03826904296875,-2866.6923828125], KorokType.LightChase, "On flat hill");
		this.addKorok("H33", [-3115.9697265625,496.3582458496094,-2806.23388671875], KorokType.IceBlock);
		this.addKorok("H34", [-3061.220947265625,535.21484375,-2813.68603515625], KorokType.IceBlock);
		this.addKorok("H35", [-2830.5556640625,669.6174926757812,-2828.34521484375], KorokType.LiftRock, "Clear Ragdoll");
		this.addKorok("H36", [-2467.77001953125,620.801025390625,-2765.2216796875], KorokType.RockCircle, "2");
		this.addKorok("H37", [-1781.002197265625,347.36883544921875,-2745.01708984375], KorokType.LightChase);
		this.addKorok("H38", [-1349.3760986328125,241.70277404785156,-2734.518798828125], KorokType.LiftRockRubble);
		this.addKorok("H39", [-4192.80712890625,288.37347412109375,-2678.943359375], KorokType.FlowerChase, "A bit over updraft");
		this.addKorok("H40", [-4330.8623046875,441.88916015625,-2600.161376953125], KorokType.LiftRock, "Top of hill");
		this.addKorok("H41", [-4148.7578125,216.39564514160156,-2616.475341796875], KorokType.RockCircle);
		this.addKorok("H42", [-4071.819091796875,131.412353515625,-2545.948974609375], KorokType.LiftRockRubble, "Drop down 2 levels");
		this.addKorok("H43", [-3277.423583984375,585.3269653320312,-2618.864990234375], KorokType.AcornLog);
		this.addKorok("H44", [-2984.8955078125,559.2073364257812,-2693.5263671875], KorokType.Balloon, "In cave");
		this.addKorok("H45", [-2736.110107421875,456.8800048828125,-2582.830078125], KorokType.IceBlock);
		this.addKorok("H46", [-3041.119384765625,430.436279296875,-2520.181396484375], KorokType.IceBlock);
		this.addKorok("H47", [-2900.08447265625,498.6470947265625,-2508.787109375], KorokType.Balloon, "End of river BA");
		this.addKorok("H48", [-2936.53369140625,471.20458984375,-2412.460205078125], KorokType.LiftRock, "On ledge");
		this.addKorok("H49", [-2883.832763671875,521.3348388671875,-2398.01513671875], KorokType.Race, "Run finish race");
		this.addKorok("H50", [-2836.292236328125,501.8753356933594,-2423.83544921875], KorokType.Balloon, "Middle of river");
		this.addKorok("H51", [-2638.89990234375,410.03778076171875,-2364.10009765625], KorokType.LiftRock, "Ledge down the camp");
		this.addKorok("H52", [-2015.5521240234375,347.55010986328125,-2456.001708984375], KorokType.AcornLog);
		this.addKorok("H53", [-4340.228515625,301.8516540527344,-2354.1044921875], KorokType.LiftRock, "Sharp hill");
		this.addKorok("H54", [-3677.898681640625,426.2462463378906,-2466.754638671875], KorokType.LiftRock);
		this.addKorok("H55", [-3331.949951171875,508.7437744140625,-2297.166748046875], KorokType.Balloon);
		this.addKorok("H56", [-2751.3369140625,459.46630859375,-2258.77685546875], KorokType.FlowerChase, "Across bridge");
		this.addKorok("H57", [-2297.36767578125,424.8450927734375,-2293.148681640625], KorokType.SnowballGolf);
		this.addKorok("H58", [-1764.0,343.6976013183594,-2350.703857421875], KorokType.LiftRockLeaves);
		this.addKorok("H59", [-1414.648193359375,228.5877227783203,-2398.596435546875], KorokType.BoulderGolf);
		this.addKorok("H60", [-4507.2353515625,226.34056091308594,-2146.1083984375], KorokType.Balloon);
		this.addKorok("H61", [-2382.549560546875,498.7340393066406,-2132.6796875], KorokType.LiftRock, "Peak");
		this.addKorok("H62", [-1682.217529296875,353.4707946777344,-2184.83837890625], KorokType.Balloon, "1 below 2 behind");
		this.addKorok("H63", [-1675.992431640625,96.53553009033203,-2139.30224609375], KorokType.LiftRock, "Ledge");
		this.addKorok("H64", [-2636.62109375,444.7024230957031,-2048.3515625], KorokType.LiftRock, "Behind shrine");
		this.addKorok("H65", [-2791.129638671875,397.6961364746094,-1945.5982666015625], KorokType.Confetti, "Top of tree (island)");
		this.addKorok("H66", [-2972.8115234375,377.29998779296875,-1878.1021728515625], KorokType.LilyPads, "No Drown");
		this.addKorok("H67", [-2358.59521484375,385.0072326660156,-1872.80859375], KorokType.Well);
		this.addKorok("H68", [-2012.5999755859375,127.18310546875,-1921.699951171875], KorokType.LiftRock);
		this.addKorok("H69", [-2523.397216796875,364.82720947265625,-1736.94677734375], KorokType.AcornLog, "Midair");
		this.addKorok("H70", [-2338.221435546875,369.2435302734375,-1726.701171875], KorokType.FlowerChase);
		this.addKorok("H71", [-2207.4873046875,253.30300903320312,-1767.4671630859375], KorokType.LiftRockRubble);
		this.addKorok("H72", [-2836.955078125,348.833251953125,-1594.7816162109375], KorokType.Confetti, "Top of windmill");
		this.addKorok("H73", [-2826.25390625,193.149658203125,-1580.078125], KorokType.Race, ".dir(<N)", [
			[-2771.7198918125027,-1476]
		]);
		this.addKorok("K01", [206.7611083984375,233.04396057128906,-3559.00537109375], KorokType.LiftRock, "On peak FAR");
		this.addKorok("K02", [603.397705078125,249.91195678710938,-3633.770263671875], KorokType.BlockPuzzle);
		this.addKorok("K03", [1143.4027099609375,209.96311950683594,-3742.77783203125], KorokType.RockCircle);
		this.addKorok("K04", [863.9169921875,316.28009033203125,-3358.529052734375], KorokType.Balloon, "5 around tree");
		this.addKorok("K05", [-486.718505859375,231.99478149414062,-3142.91650390625], KorokType.Balloon, "Backflip BT");
		this.addKorok("K06", [-40.78424072265625,306.5024719238281,-2985.747314453125], KorokType.AcornLog, "Shoot from midair");
		this.addKorok("K07", [237.4364013671875,304.0661315917969,-2943.3857421875], KorokType.Balloon, "No BT");
		this.addKorok("K08", [685.1260986328125,431.88775634765625,-2758.45849609375], KorokType.Balloon, "Instant Shoot");
		this.addKorok("K09", [-1045.919921875,54.660438537597656,-2707.637939453125], KorokType.LiftRock, "Behind statue");
		this.addKorok("K10", [-1047.625244140625,139.686279296875,-2620.560791015625], KorokType.BlockPuzzle, "Cube behind left group");
		this.addKorok("K11", [-567.7869262695312,489.6004333496094,-2599.202880859375], KorokType.LiftRock, "Peak FAR");
		this.addKorok("K12", [-1258.6329345703125,138.61244201660156,-2360.095703125], KorokType.LiftRockRubble);
		this.addKorok("K13", [-1403.1171875,101.02722930908203,-2312.2890625], KorokType.LiftRockRubble);
		this.addKorok("K14", [-1410.552001953125,1.018336296081543,-2224.806884765625], KorokType.LiftRockDoor);
		this.addKorok("K15", [-1586.487548828125,68.14883422851562,-2133.00244140625], KorokType.LiftRock, "On pillar");
		this.addKorok("K16", [-1019.515625,222.8577423095703,-2077.296630859375], KorokType.AcornLog);
		this.addKorok("K17", [-1309.7647705078125,209.07086181640625,-1941.56005859375], KorokType.JumpFence, "Summon Horse");
		this.addKorok("K18", [-1062.99365234375,226.91311645507812,-1934.1090087890625], KorokType.Confetti, "Top of broken hut");
		this.addKorok("K19", [-816.6761474609375,224.4610595703125,-1926.15673828125], KorokType.AcornLog);
		this.addKorok("K20", [-1884.490966796875,23.983455657958984,-1813.18115234375], KorokType.LiftRock, "End of ledge");
		this.addKorok("K21", [-1805.356689453125,31.562808990478516,-1842.5272216796875], KorokType.LiftRockRubble);
		this.addKorok("K22", [-2036.946044921875,48.707401275634766,-1622.945556640625], KorokType.LiftRockRubble, "In corner");
		this.addKorok("K23", [-1436.2889404296875,231.00271606445312,-1668.661865234375], KorokType.AcornLog, "Shoot midair");
		this.addKorok("K24", [-1227.2393798828125,255.9599609375,-1578.17578125], KorokType.LightChase);
		this.addKorok("K25", [-1094.138671875,210.87783813476562,-1731.893798828125], KorokType.RockCircle);
		this.addKorok("K26", [-911.800048828125,219.25103759765625,-1612.798583984375], KorokType.Balloon, "Pinwheel");
		this.addKorok("K27", [-427.4000549316406,317.6272888183594,-1734.0474853515625], KorokType.Balloon);
		this.addKorok("K28", [-332.5940246582031,299.3984069824219,-1747.3878173828125], KorokType.LiftRock);
		this.addKorok("K29", [-703.6861572265625,247.65782165527344,-1443.7852783203125], KorokType.AcornLog);
		this.addKorok("K30", [-130.54171752929688,168.7774658203125,-1379.27880859375], KorokType.LiftRock, "Ledge");
		this.addKorok("K31", [1008.1305541992188,270.2618713378906,-1564.0186767578125], KorokType.LiftRock, "Top of scaffolding");
		this.addKorok("K32", [868.015869140625,209.815185546875,-1362.16552734375], KorokType.AcornTree);
		this.addKorok("K33", [1197.520751953125,126.97148132324219,-1152.6295166015625], KorokType.BlockPuzzle);
		this.addKorok("K34", [1282.641845703125,129.64999389648438,-1123.445068359375], KorokType.LilyPads, "No Drown");
		this.addKorok("K35", [1694.8717041015625,141.9547882080078,-862.08544921875], KorokType.BlockPuzzle);
		this.addKorok("L01", [323.4945373535156,118.23832702636719,1927.426513671875], KorokType.Well);
		this.addKorok("L02", [354.38446044921875,114.56708526611328,1997.5462646484375], KorokType.LiftRock, "In big tree stump");
		this.addKorok("L03", [34.274688720703125,115.55474853515625,2102.72607421875], KorokType.BlockPuzzle,);
		this.addKorok("L04", [214.57583618164062,170.07611083984375,2070.05908203125], KorokType.TreeStump);
		this.addKorok("L05", [400.8697509765625,142.06185913085938,2150.86767578125], KorokType.FlowerChase);
		this.addKorok("L06", [474.95770263671875,115.26290130615234,2149.122314453125], KorokType.LightChase);
		this.addKorok("L07", [908.2864990234375,247.17340087890625,2193.5263671875], KorokType.BoulderGolf, "5 STS hits aim straight");
		this.addKorok("L08", [-609.807373046875,95.24519348144531,2390.652587890625], KorokType.Race, "SQ DEFUSE");
		this.addKorok("L09", [-68.02020263671875,91.39094543457031,2332.616455078125], KorokType.Basketball);
		this.addKorok("L10", [66.22549438476562,94.00381469726562,2310.64990234375], KorokType.LilyPads, "No Drown");
		this.addKorok("L11", [284.2921142578125,146.7981719970703,2253.375732421875], KorokType.TreeStump);
		this.addKorok("L12", [625.164794921875,164.76593017578125,2305.90576171875], KorokType.BlockPuzzle, "Piece on tree");
		this.addKorok("L13", [755.69189453125,194.09799194335938,2347.60546875], KorokType.LiftRockRubble);
		this.addKorok("L14", [-74.38333129882812,90.54818725585938,2412.872314453125], KorokType.LiftRockSlab, "STS a lot");
		this.addKorok("L15", [-66.24554443359375,124.004638671875,2440.656982421875], KorokType.Balloon, "In pillar");
		this.addKorok("L16", [280.4268493652344,97.65098571777344,2405.01025390625], KorokType.BoulderGolf, "Bomb down stasis");
		this.addKorok("L17", [604.9340209960938,177.158203125,2408.78125], KorokType.LightChase);
		this.addKorok("L18", [609.2872314453125,177.2308807373047,2409.829345703125], KorokType.LightChase);
		this.addKorok("L19", [889.6107177734375,180.86534118652344,2395.302734375], KorokType.LiftRockTree, "Top of big tree");
		this.addKorok("L20", [833.7554321289062,145.33822631835938,2434.576416015625], KorokType.BlockPuzzle);
		this.addKorok("L21", [-1379.5859375,215.09481811523438,2742.73388671875], KorokType.BlockPuzzle);
		this.addKorok("L22", [-1214.3134765625,193.47325134277344,2701.553955078125], KorokType.AcornHanging, "From tree");
		this.addKorok("L23", [-1011.9100341796875,330.5799865722656,2638.469970703125], KorokType.Confetti, "Top of tree");
		this.addKorok("L24", [-601.9537353515625,90.30075073242188,2656.119384765625], KorokType.LiftRock, "3rd hole");
		this.addKorok("L25", [-398.3999938964844,103.86998748779297,2559.239990234375], KorokType.Confetti, "Top of tree");
		this.addKorok("L26", [-54.775054931640625,128.9468994140625,2492.439697265625], KorokType.TreeBranch);
		this.addKorok("L27", [-38.982666015625,152.95071411132812,2513.642822265625], KorokType.Confetti, "Top of fountain");
		this.addKorok("L28", [518.3895874023438,211.54824829101562,2492.62548828125], KorokType.FlowerCount, "On peak");
		this.addKorok("L29", [679.1974487304688,244.7956085205078,2499.42236328125], KorokType.LiftRock, "Peak");
		this.addKorok("L30", [-12.472137451171875,119.77305603027344,2586.321044921875], KorokType.FlowerChase);
		this.addKorok("L31", [-3.030242919921875,90.67200469970703,2614.6669921875], KorokType.LiftRock);
		this.addKorok("L32", [200.87042236328125,92.3492431640625,2603.860107421875], KorokType.MetalBoxCircle);
		this.addKorok("L33", [370.41778564453125,92.51205444335938,2567.04296875], KorokType.Balloon);
		this.addKorok("L34", [790.6397705078125,159.60658264160156,2565.134765625], KorokType.BoulderCircle, "STS Jump ATK down");
		//this.addKorok("L35", [584.4321899414062,217.51046752929688,2678.335205078125], KorokType.MatchTree,txt("Right, ", "2 durians"));
		this.addKorok("L36", [-1066.794189453125,208.43386840820312,2910.010986328125], KorokType.Balloon, "Bomb in tree");
		this.addKorok("L37", [-925.2400512695312,237.01283264160156,2936.440185546875], KorokType.AcornLog);
		this.addKorok("L38", [-468.642333984375,98.70972442626953,2908.23193359375], KorokType.BlockPuzzle, "2nd hole");
		this.addKorok("L39", [163.27627563476562,90.20759582519531,2783.298583984375], KorokType.LiftRock);
		this.addKorok("L40", [340.6279296875,94.2322006225586,2830.62939453125], KorokType.AcornTree);
		this.addKorok("L41", [-1256.7425537109375,323.0287170410156,3134.150634765625], KorokType.LiftRockRubble);
		this.addKorok("L42", [224.17166137695312,135.20912170410156,2868.4033203125], KorokType.BoulderGolf, "Bomb in");
		this.addKorok("L43", [169.73223876953125,118.7292709350586,2903.415771484375], KorokType.LightChase);
		this.addKorok("L44", [418.2094421386719,128.012451171875,2873.406494140625], KorokType.BoulderGolf);
		this.addKorok("L45", [610.3417358398438,206.40016174316406,2869.851318359375], KorokType.LiftRock);
		this.addKorok("L46", [1173.39501953125,192.6688690185547,2849.989013671875], KorokType.LiftRock, "Top of small waterfall");
		this.addKorok("L47", [-387.59381103515625,152.98094177246094,3151.552734375], KorokType.Race);
		this.addKorok("L48", [-150.92001342773438,143.3865203857422,3067.300048828125], KorokType.LiftRock);
		this.addKorok("L49", [-95.25006103515625,144.6425018310547,3128.95654296875], KorokType.RockCircle);
		this.addKorok("L50", [-26.89398193359375,107.81006622314453,3042.689697265625], KorokType.BlockPuzzle);
		this.addKorok("L51", [153.94992065429688,143.8689422607422,2981.7177734375], KorokType.BoulderGolf, "2 STS + bomb in");
		this.addKorok("L52", [406.11358642578125,139.90000915527344,3051.13427734375], KorokType.LiftRock, "On pillar");
		this.addKorok("L53", [581.2494506835938,123.03912353515625,3007.602783203125], KorokType.TreeStump, "Left next to shrine");
		this.addKorok("L54", [704.0371704101562,120.0,2957.8349609375], KorokType.LilyPads, "No Drown");
		this.addKorok("L55", [695.5232543945312,119.43766784667969,3071.40966796875], KorokType.FlowerChase);
		this.addKorok("L56", [824.9434204101562,120.73628997802734,3005.300537109375], KorokType.BoulderCircle, "STS + Magnesis");
		this.addKorok("L57", [806.0728759765625,124.54973602294922,3112.856201171875], KorokType.LightChase);
		this.addKorok("L58", [1196.099853515625,132.03419494628906,3055.431396484375], KorokType.LightChase);
		this.addKorok("L59", [56.6949462890625,109.89762878417969,3150.02294921875], KorokType.LilyPads, "No Drown");
		this.addKorok("L60", [69.03472900390625,127.1400375366211,3221.873291015625],KorokType.LiftRockRubble);
		this.addKorok("L61", [742.8929443359375,134.01922607421875,3243.07958984375], KorokType.LiftRockSlab, "STS 1 hit");
		this.addKorok("L62", [-923.5009765625,214.58187866210938,3436.38037109375], KorokType.LiftRockRubble, "Middle of 3");
		this.addKorok("L63", [-420.7541809082031,141.37472534179688,3368.48388671875], KorokType.OfferApple);
		this.addKorok("L64", [-227.28472900390625,176.72787475585938,3342.733642578125], KorokType.FlowerChase);
		this.addKorok("L65", [271.719482421875,222.37265014648438,3289.58935546875], KorokType.Race, "Ordinal");
		this.addKorok("L66", [699.9200439453125,133.67205810546875,3276.862548828125], KorokType.Basketball, "Cryo block");
		this.addKorok("L67", [-1176.850830078125,344.994873046875,3578.0537109375], KorokType.Balloon, "SBR");
		this.addKorok("L68", [-1125.951416015625,315.8488464355469,3624.427734375], KorokType.LightChase);
		this.addKorok("L69", [-878.7282104492188,245.87454223632812,3567.742919921875], KorokType.BlockPuzzle);
		this.addKorok("L70", [216.32260131835938,199.1464080810547,3488.014892578125], KorokType.AcornFlying, "Bomb Arrow if can");
		this.addKorok("L71", [279.02508544921875,184.6331329345703,3503.7900390625], KorokType.RockCircle);
		this.addKorok("L72", [963.302978515625,173.48321533203125,3371.102783203125], KorokType.Race, ".dir(N>) Turn");
		this.addKorok("L73", [266.10235595703125,276.4652404785156,3668.951416015625], KorokType.Balloon, "On peak");
		this.addKorok("L74", [367.0970458984375,176.9334716796875,3642.119140625], KorokType.BoulderGolf, "Drop down STS");
		this.addKorok("L75", [645.7246704101562,152.3000030517578,3615.123046875], KorokType.LilyPads, "No Drown");
		this.addKorok("L76", [522.4663696289062,166.30335998535156,3680.958251953125], KorokType.BoulderGolf, "Stasis 2 + BTMA");
		this.addKorok("L77", [639.39111328125,219.09579467773438,3710.8388671875], KorokType.RockCircle);
		this.addKorok("L78", [891.1671142578125,284.3682556152344,3694.826904296875], KorokType.LiftRock, "Peak");
		this.addKorok("L79", [1074.549560546875,182.09524536132812,3620.944580078125], KorokType.RockCircle);
		this.addKorok("L80", [-657.7655029296875,187.62057495117188,3851.837646484375], KorokType.Race, "cardinal");
		this.addKorok("L81", [-354.8371276855469,182.5916290283203,3898.782958984375], KorokType.LiftRock);
		this.addKorok("L82", [-266.3544006347656,125.15032958984375,3888.1533203125], KorokType.Confetti, "Top of palm tree");
		this.addKorok("L83", [-248.98980712890625,130.3179473876953,3828.449951171875], KorokType.LiftRockRubble);
		this.addKorok("L84", [-240.11111450195312,106.07636260986328,3882.502197265625], KorokType.LightChase);
		this.addKorok("L85", [-135.837890625,105.97085571289062,3802.003662109375], KorokType.RockCircle);
		this.addKorok("L86", [13.9576416015625,106.5948257446289,3790.429931640625], KorokType.LiftRockBoulder);
		this.addKorok("L87", [97.36087036132812,145.46632385253906,3821.547607421875], KorokType.LiftRock, "Top of rock");
		this.addKorok("L88", [265.6219482421875,111.81475830078125,3837.0078125], KorokType.LightChase);
		this.addKorok("L89", [286.8358154296875,109.9000015258789,3899.42236328125], KorokType.LilyPads, "SEAWEED");
		this.addKorok("L90", [416.757080078125,106.41260528564453,3848.9228515625], KorokType.BlockPuzzle);
		this.addKorok("L91", [517.5667724609375,193.85452270507812,3765.022705078125], KorokType.RockCircle);
		this.addKorok("L92", [909.6229248046875,183.59579467773438,3837.292236328125], KorokType.BlockPuzzle);
		this.addKorok("N01", [1980.9288330078125,174.2776336669922,451.9175720214844], KorokType.LiftRockTree);
		this.addKorok("N02", [2378.2900390625,231.61630249023438,373.14678955078125], KorokType.LiftRockTree);
		this.addKorok("N03", [2635.69287109375,269.5276184082031,370.994140625], KorokType.LiftRockTree, "behind shrine");
		this.addKorok("N04", [2473.888916015625,231.46963500976562,461.69635009765625], KorokType.AcornFlying, "Bullet time");
		this.addKorok("N05", [2684.855224609375,218.5164337158203,562.78173828125], KorokType.LightChase, "Small pond");
		this.addKorok("N06", [2891.032958984375,234.15953063964844,517.8709716796875], KorokType.Confetti, "Top of tall tree");
		this.addKorok("N07", [2132.42236328125,321.1150817871094,678.8488159179688], KorokType.MatchTree, "Bomb left");
		this.addKorok("N08", [2149.357421875,262.5130920410156,790.002685546875], KorokType.BlockPuzzle);
		this.addKorok("N09", [2239.6650390625,337.9714660644531,726.352783203125], KorokType.OfferApple);
		this.addKorok("N10", [2288.52685546875,250.7978973388672,699.621337890625], KorokType.FlowerChase);
		this.addKorok("N11", [2409.546875,269.6052551269531,849.3189086914062], KorokType.BoulderGolf, "WB away after");
		this.addKorok("N12", [3951.8671875,106.3174057006836,695.8883666992188], KorokType.RockCircle);
		this.addKorok("N13", [2728.916748046875,342.0907897949219,904.3299560546875], KorokType.BoulderCircle, "2 separate STS hits");
		this.addKorok("N14", [3383.031982421875,118.78684997558594,982.823974609375], KorokType.RockCircle);
		this.addKorok("N15", [2636.16552734375,205.28482055664062,1108.99658203125], KorokType.LilyPads);
		this.addKorok("N16", [2705.439208984375,203.10247802734375,1164.945068359375], KorokType.LiftRock);
		this.addKorok("N17", [3432.941650390625,342.9528503417969,1150.31005859375], KorokType.Race, ".dir(S) Round First DEFUSE");
		this.addKorok("N18", [3741.7197265625,542.51318359375,1156.1209716796875], KorokType.IceBlock, "3 Fire Arrows");
		this.addKorok("N19", [4087.93603515625,423.3066101074219,1142.3707275390625], KorokType.RockCircle);
		this.addKorok("N20", [2526.6171875,334.8270263671875,1257.578857421875], KorokType.RockCircle);
		this.addKorok("N21", [2925.4677734375,478.7520751953125,1401.5732421875], KorokType.LiftRock, "Peak (FAR)");
		this.addKorok("N22", [3277.773681640625,346.3460693359375,1436.0028076171875], KorokType.BlockPuzzle);
		this.addKorok("N23", [3537.01171875,313.5477600097656,1376.1134033203125], KorokType.LightChase, "In forest");
		this.addKorok("N24", [3797.93017578125,577.8524169921875,1269.1971435546875], KorokType.IceBlock, "Behind peak 4 Fire Arrows");
		this.addKorok("N25", [4438.90576171875,141.72239685058594,1432.915771484375], KorokType.BoulderGolf, "Bomb + STS");
		this.addKorok("N26", [2276.033935546875,162.258056640625,1501.6207275390625], KorokType.BoulderGolf, "WB away after");
		this.addKorok("N27", [2279.31494140625,182.42678833007812,1608.3450927734375], KorokType.LiftRockRubble);
		this.addKorok("N28", [2511.433349609375,120.03659057617188,1571.525390625], KorokType.OfferApple);
		this.addKorok("N29", [3171.940673828125,293.84820556640625,1490.9354248046875], KorokType.LilyPads, "No Drown");
		this.addKorok("N30", [3229.0322265625,302.8330993652344,1545.2454833984375], KorokType.MatchTree, "Farthest tree from lake");
		this.addKorok("N31", [3896.64013671875,416.6681213378906,1556.5400390625], KorokType.IceBlock, "3 Fire Arrows");
		this.addKorok("N32", [4282.685546875,289.039794921875,1655.6658935546875], KorokType.Race, "SQ");
		this.addKorok("N33", [2320.66796875,119.27433776855469,1726.366943359375], KorokType.LiftRockDoor);
		this.addKorok("N34", [2330.775634765625,133.96302795410156,1828.0120849609375], KorokType.AcornFlying);
		this.addKorok("N35", [2495.853271484375,205.5029296875,1804.201904296875], KorokType.BlockPuzzle);
		this.addKorok("N36", [2884.091552734375,160.92068481445312,1765.02685546875], KorokType.AcornTree);
		this.addKorok("N37", [3178.81201171875,177.00070190429688,1607.3035888671875], KorokType.LilyPads, "C ryo block DIVE");
		this.addKorok("N38", [3166.323974609375,193.83096313476562,1828.8909912109375], KorokType.Balloon);
		this.addKorok("N39", [3525.98388671875,454.0448303222656,1710.623291015625], KorokType.Race, ".dir(W) Round First", [
			[3735.97, 1686.96],
			[3525.98388671875,1710.623291015625]
		]);
		this.addKorok("N40", [4615.14306640625,106.21733093261719,1915.4744873046875], KorokType.LiftRockSlab);
		this.addKorok("N41", [3029.03564453125,114.80000305175781,2017.677001953125], KorokType.LilyPads, "Cryo block");
		this.addKorok("N42", [3475.63916015625,278.69317626953125,1916.26123046875], KorokType.LiftRockTree, "Next to blue flame");
		this.addKorok("N43", [3709.19091796875,301.45147705078125,1943.08740234375], KorokType.LiftRockTree, "middle of lake");
		this.addKorok("N44", [4274.36376953125,430.79315185546875,1981.020751953125], KorokType.FlowerChase);
		this.addKorok("N45", [2836.320068359375,126.63225555419922,2120.507080078125], KorokType.Balloon);
		this.addKorok("N46", [2863.860595703125,140.26490783691406,2182.902587890625], KorokType.LiftRockDoor);
		this.addKorok("N47", [3783.725341796875,390.7210998535156,2125.18359375], KorokType.Confetti, "Top of lab");
		this.addKorok("N48", [3901.081787109375,235.8000030517578,2096.729248046875], KorokType.LilyPads, "Drown");
		this.addKorok("N49", [2714.133056640625,225.53280639648438,2345.552978515625], KorokType.AcornTree, "Shoot from N50");
		this.addKorok("N50", [2811.315673828125,239.61886596679688,2391.925537109375], KorokType.MatchTree, "Get Wood");
		this.addKorok("N51", [2991.392822265625,118.1034164428711,2272.145751953125], KorokType.LiftRock, "Side of lake");
		this.addKorok("N52", [3144.466552734375,163.40933227539062,2229.854736328125], KorokType.AcornTree);
		this.addKorok("N53", [3347.619384765625,209.94203186035156,2249.251708984375], KorokType.LiftRock);
		this.addKorok("N54", [4211.83447265625,106.38948822021484,2270.373046875], KorokType.OfferPalmFruit, "In cave");
		this.addKorok("N55", [4518.49658203125,219.77978515625,2316.516357421875], KorokType.Balloon, "Turn Right");
		this.addKorok("N56", [4541.93212890625,109.80001831054688,2405.6396484375], KorokType.LilyPads, "Cryo block wb");
		this.addKorok("N57", [4662.7119140625,169.59861755371094,2376.256103515625], KorokType.FlowerChase);
		this.addKorok("N58", [3148.7197265625,277.1993408203125,2402.7802734375], KorokType.BlockPuzzle);
		this.addKorok("N59", [3420.94384765625,340.356201171875,2390.287109375], KorokType.FlowerChase, "6 before going right", [
			[3372.9499578534123,2302],
			[3392.4461460492766,2304.5],
			[3420.940574950926,2319],
			[3443.436176715386,2343.5],
			[3459.9329513426565,2342.5],
			[3472.930410139901,2346.5],
			[3470.4308988327393,2365],
			[3454.933928728333,2383],
			[3442.936274453954,2391.5],
			[3426.9394020881155,2390],
			[3420.94, 2390.29]
		]);
		this.addKorok("N60", [3687.95947265625,107.3201675415039,2413.49267578125], KorokType.Basketball, "Cryo GG Throw");
		this.addKorok("N61", [3516.11767578125,160.20758056640625,2628.381591796875], KorokType.RockCircle);
		this.addKorok("N62", [4110.9775390625,111.15515899658203,2588.167724609375], KorokType.FlowerChase, "Start on beach");
		this.addKorok("N63", [4536.525390625,106.4407730102539,2520.272216796875], KorokType.RockCircle, "3");
		//this.addKorok("N64", [3229.814697265625,256.5484313964844,2848.442138671875], KorokType.MatchTree, txt("Right tree", rne("STS"), " BA"));
		this.addKorok("N65", [3441.938232421875,216.0830535888672,3121.87646484375], KorokType.RockCircle);
		this.addKorok("N66", [4083.595458984375,109.36405944824219,2973.261474609375], KorokType.Race);
		this.addKorok("P01", [-822.6375122070312,171.23388671875,1546.9208984375], KorokType.LiftRock, "Under rocks");
		this.addKorok("P02", [-769.883056640625,175.22134399414062,1574.2252197265625], KorokType.TreeStump);
		this.addKorok("P03", [-1334.809326171875,232.67037963867188,1675.89990234375], KorokType.BlockPuzzle);
		this.addKorok("P04", [-965.4801025390625,187.20907592773438,1625.696533203125], KorokType.FlowerChase, "Middle of log", [
			[-997.25,1662],
			[-988.25,1651],
			[-979,1646.5],
			[-978,1633.75]
		]);
		this.addKorok("P05", [-853.2324829101562,181.4210205078125,1671.2191162109375], KorokType.LiftRockLeaves);
		this.addKorok("P06", [-953.0681762695312,201.55020141601562,1721.4840087890625], KorokType.LiftRock, "Top of hill");
		this.addKorok("P07", [-1503.422119140625,297.22650146484375,1920.173583984375], KorokType.IceBlock);
		this.addKorok("P08", [-1382.2691650390625,249.27081298828125,1858.03662109375], KorokType.Confetti, "Cryo log");
		this.addKorok("P09", [-1132.60595703125,238.22544860839844,1917.72314453125], KorokType.Confetti, "Inside SOR");
		this.addKorok("P10", [-887.3223876953125,208.14138793945312,1891.40673828125], KorokType.LilyPads, "No Drown");
		this.addKorok("P11", [-809.2235107421875,297.75286865234375,1966.90869140625], KorokType.Confetti, "Top of ToT");
		this.addKorok("P12", [-423.0227966308594,169.4002227783203,1993.361083984375], KorokType.LiftRockDoor);
		this.addKorok("P13", [-423.3546142578125,125.26058197021484,2022.456787109375], KorokType.LiftRockDoor);
		this.addKorok("P14", [-1443.1190185546875,284.25286865234375,2105.639892578125], KorokType.BlockPuzzle);
		this.addKorok("P15", [-1363.46630859375,335.70526123046875,2215.195068359375], KorokType.RockCircle);
		this.addKorok("P16", [-1204.3555908203125,329.3479919433594,2322.776123046875], KorokType.LiftRockSlab, "1 STS");
		this.addKorok("P17", [-1171.6175537109375,342.5077209472656,2317.2255859375], KorokType.LiftRock);
		this.addKorok("P18", [-792.0360107421875,201.39720153808594,2257.222900390625], KorokType.Confetti, "Top of hut");
		this.addKorok("R01", [-2210.59912109375,152.8291778564453,-1621.4000244140625], KorokType.BlockPuzzle);
		this.addKorok("R02", [-2217.828857421875,321.1887512207031,-1565.0242919921875], KorokType.LiftRock);
		this.addKorok("R03", [-2083.9609375,293.08807373046875,-1558.7252197265625], KorokType.LiftRockRubble);
		this.addKorok("R04", [-2516.125,61.96953201293945,-1436.3052978515625], KorokType.RockCircle, "In Canyon");
		this.addKorok("R05", [-2636.28369140625,300.5481262207031,-1246.9912109375], KorokType.AcornTree);
		this.addKorok("R06", [-2022.6539306640625,390.9383239746094,-1300.6322021484375], KorokType.Confetti, "Top of bare tree");
		this.addKorok("R07", [-1077.380126953125,238.53562927246094,-1278.7080078125], KorokType.LiftRockTree);
		this.addKorok("R08", [-2383.52783203125,211.8480682373047,-1150.631591796875], KorokType.LiftRockRubble);
		this.addKorok("R09", [-1855.98583984375,395.4963684082031,-1192.5411376953125], KorokType.Race, "Run", [
			[-1895.6588821373189,-1237]
		]);
		this.addKorok("R10", [-1230.5174560546875,207.6726837158203,-999.8165283203125], KorokType.FlowerChase);
		this.addKorok("R11", [-1017.8599243164062,116.95942687988281,-1066.078125], KorokType.Basketball);
		this.addKorok("R12", [-3109.25927734375,34.179054260253906,-909.265380859375], KorokType.Confetti, "Top of flagpole");
		this.addKorok("R13", [-2669.5595703125,375.5662536621094,-864.3911743164062], KorokType.LiftRock, "Top of waterfall");
		this.addKorok("R14", [-2316.800048828125,206.68138122558594,-806.4524536132812], KorokType.LightChase);
		this.addKorok("R15", [-2060.660400390625,259.4978942871094,-775.787109375], KorokType.RockCircle, "3 on mushroom tree");
		this.addKorok("R16", [-1142.4189453125,182.62680053710938,-761.9466552734375], KorokType.BlockPuzzle);
		this.addKorok("R17", [-2698.4189453125,414.5990295410156,-766.74755859375], KorokType.LiftRock, "Top of mountain");
		this.addKorok("R18", [-1964.6759033203125,221.20407104492188,-584.1647338867188], KorokType.Race, "Run", [
			[-1986.3990853800865,-624]
		]);
		this.addKorok("R19", [-1125.2794189453125,157.91024780273438,-675.4301147460938], KorokType.BoulderGolf, "WB away after");
		this.addKorok("R20", [-3207.78857421875,37.56471252441406,-494.89276123046875], KorokType.BlockPuzzle);
		this.addKorok("R21", [-2715.904541015625,269.5669250488281,-429.86431884765625], KorokType.LightChase);
		this.addKorok("R22", [-2434.114501953125,319.8664245605469,-491.0356750488281], KorokType.Balloon, "Aim a bit above");
		this.addKorok("R23", [-2030.1220703125,206.47280883789062,-547.6038208007812], KorokType.FlowerChase, "", [
			[-2052.12, -507.62],
			[-2052.1001626051984,-496.5],
			[-2057.598010674227,-483.5],
			[-2031.6081834388178,-509]
		]);
		this.addKorok("R24", [-2008.6837158203125,210.31417846679688,-514.1512451171875], KorokType.LilyPads, "No Drown");
		this.addKorok("R25", [-1631.5433349609375,210.43133544921875,-515.1944580078125], KorokType.Race, "Ordinal Delay", [
			[-1780.0046951221193,-376],
		]);
		this.addKorok("R26", [-1115.558837890625,151.9816436767578,-528.5892944335938], KorokType.Race, ".dir(W)", [
			[-995.1983689095141,-541]
		]);
		this.addKorok("R27", [-1092.0841064453125,129.02041625976562,-497.5137939453125], KorokType.AcornHanging, "From bridge");
		this.addKorok("R28", [-3327.44970703125,3.9244332313537598,-336.92486572265625], KorokType.LiftRockSlab);
		this.addKorok("R29", [-3207.55078125,5.9172258377075195,-333.98638916015625], KorokType.LiftRock, "In between rocks");
		this.addKorok("R30", [-2547.83154296875,299.9423522949219,-306.30230712890625], KorokType.Race, "SQ", [
			[-2460.19993395022,-276]
		]);
		this.addKorok("R31", [-2370.10546875,307.0469970703125,-345.30731201171875], KorokType.Balloon, "Aim direct");
		this.addKorok("R32", [-4252.40478515625,171.9353485107422,-84.01248168945312], KorokType.Balloon, "");
		this.addKorok("R33", [-4026.70849609375,145.2114715576172,-232.40640258789062], KorokType.RockCircle);
		this.addKorok("R34", [-3861.73193359375,101.01025390625,-147.15509033203125], KorokType.AcornHanging, "below tower");
		this.addKorok("R35", [-3828.83935546875,160.15953063964844,-118.42416381835938], KorokType.Race, "SQ DEFUSE", [
			[-3822.16, -170.91]
		]);
		this.addKorok("R36", [-3476.201904296875,154.938232421875,-69.0582275390625], KorokType.LiftRock, "On ledge");
		this.addKorok("R37", [-2312.608642578125,262.6300048828125,24.01629638671875], KorokType.LiftRock, "Ledge");
		this.addKorok("R38", [-1877.9033203125,243.70318603515625,-32.1837158203125], KorokType.MatchTree, "Right tree");
		this.addKorok("R39", [-1691.9849853515625,224.96990966796875,-175.52853393554688], KorokType.LightChase, "Near 2 rocks");
		this.addKorok("R40", [-1590.0386962890625,210.7338409423828,-229.13458251953125], KorokType.LiftRockSlab);
		this.addKorok("R41", [-1651.15966796875,224.81219482421875,-39.068389892578125], KorokType.FlowerCount);
		this.addKorok("R42", [-1372.535888671875,115.84695434570312,-107.98687744140625], KorokType.LiftRock, "Riverbank");
		this.addKorok("R43", [-1258.4014892578125,159.7504425048828,-240.51809692382812], KorokType.Balloon, "Aim a bit above");
		this.addKorok("R44", [-1142.67138671875,116.47355651855469,-284.337158203125], KorokType.Basketball, "GG rock throw");
		this.addKorok("R45", [-1148.197509765625,149.37428283691406,-226.68539428710938], KorokType.FlowerChase, "Start at pillar");
		this.addKorok("R46", [-3461.162841796875,176.17074584960938,166.29888916015625], KorokType.FlowerCount);
		this.addKorok("R47", [-1992.89111328125,291.31500244140625,161.31961059570312], KorokType.Balloon);
		this.addKorok("R48", [-1512.017333984375,177.03860473632812,56.45965576171875], KorokType.AcornTree);
		this.addKorok("R49", [-1501.9642333984375,118.024169921875,156.21786499023438], KorokType.BlockPuzzle);
		this.addKorok("R50", [-3014.163330078125,174.95645141601562,372.4368896484375], KorokType.Balloon, "In tree");
		this.addKorok("R51", [-2450.164306640625,317.93072509765625,373.4799499511719], KorokType.RockCircle);
		this.addKorok("R52", [-2298.85986328125,462.7160949707031,341.1622314453125], KorokType.LiftRockTree);
		this.addKorok("R53", [-2041.040283203125,425.5531921386719,296.352783203125], KorokType.LiftRockRubble);
		this.addKorok("R54", [-1984.865478515625,348.4925537109375,362.946533203125], KorokType.Confetti, "Top of tree");
		this.addKorok("R55", [-1962.840576171875,314.6183166503906,409.8540344238281], KorokType.LiftRock, "In tree stump");
		this.addKorok("R56", [-1859.586669921875,272.624755859375,334.30389404296875], KorokType.AcornTree);
		this.addKorok("R57", [-1731.0760498046875,216.96560668945312,375.13177490234375], KorokType.AcornTree);
		this.addKorok("R58", [-1405.510009765625,162.6020050048828,459.7081298828125], KorokType.LiftRockTree);
		this.addKorok("R59", [-2918.60302734375,118.2453384399414,479.73492431640625], KorokType.LiftRock, "Small island");
		this.addKorok("R60", [-2290.55126953125,438.3870544433594,468.2380676269531], KorokType.LiftRockLeaves);
		this.addKorok("R61", [-2247.7197265625,446.0182800292969,464.6728515625], KorokType.FlowerChase);
		this.addKorok("R62", [-2175.12890625,407.09747314453125,463.3504638671875], KorokType.Race, "Cardinal");
		this.addKorok("R63", [-2645.97998046875,300.1651306152344,547.9241333007812], KorokType.LiftRockLeaves);
		this.addKorok("R64", [-2483.314697265625,328.14862060546875,504.7361145019531], KorokType.LiftRockRubble);
		this.addKorok("R65", [-2476.617431640625,307.23577880859375,547.6678466796875], KorokType.FlowerCount);
		this.addKorok("R66", [-2492.703857421875,310.4511413574219,589.6707763671875], KorokType.TreeStump, "Magnesis 2");
		this.addKorok("R67", [-2542.837158203125,307.78460693359375,639.858642578125], KorokType.Basketball);
		this.addKorok("R68", [-1965.812744140625,255.74005126953125,600.9498901367188], KorokType.Balloon, "Backflip");
		this.addKorok("R69", [-2053.485107421875,258.4682312011719,636.4110107421875], KorokType.AcornLog, "Shoot from far");
		this.addKorok("R70", [-2200.960205078125,358.4120178222656,730.8455200195312], KorokType.LiftRockBoulder);
		this.addKorok("R71", [-2908.738037109375,116.66447448730469,796.2659912109375], KorokType.LiftRock);
		this.addKorok("R72", [-2729.92236328125,219.93380737304688,761.3842163085938], KorokType.LiftRockLeaves);
		this.addKorok("R73", [-2351.149169921875,263.404052734375,846.1799926757812], KorokType.BoulderGolf, "Stasis + shoot");
		this.addKorok("R74", [-1551.9656982421875,167.38204956054688,815.4898681640625], KorokType.LiftRock);
		this.addKorok("R75", [-2393.36962890625,233.0457763671875,1047.3408203125], KorokType.AcornHanging, "Bomb from midair");
		this.addKorok("R76", [-2340.702392578125,249.86671447753906,1104.578857421875], KorokType.LiftRockTree);
		this.addKorok("R77", [-2099.38232421875,205.4608154296875,1104.7275390625], KorokType.AcornHanging, "From tree");
		this.addKorok("R78", [-1969.7486572265625,205.3945770263672,1087.8328857421875], KorokType.OfferApple);
		this.addKorok("R79", [-1819.30224609375,248.49351501464844,973.59814453125], KorokType.OfferApple);
		this.addKorok("R80", [-1819.0936279296875,206.17178344726562,1532.648193359375], KorokType.LiftRock);
		this.addKorok("T01", [-4019.884033203125,130.8091278076172,-2350.358642578125], KorokType.FlowerChase, "Left to rubble");
		this.addKorok("T02", [-3792.612548828125,283.47003173828125,-2320.190673828125], KorokType.Confetti, "Top of house");
		this.addKorok("T03", [-2989.56640625,222.60000610351562,-2164.9873046875], KorokType.LilyPads, "No Drown");
		this.addKorok("T04", [-3831.340576171875,248.41299438476562,-2106.70947265625], KorokType.Well);
		this.addKorok("T05", [-3418.51025390625,286.3803405761719,-2066.814697265625], KorokType.LiftRock);
		this.addKorok("T06", [-4396.837890625,183.40403747558594,-2049.884765625], KorokType.Race, ".dir(NE)");
		this.addKorok("T07", [-4330.52294921875,160.93002319335938,-2052.856689453125], KorokType.RockCircle, "3");
		this.addKorok("T08", [-4482.92578125,266.76922607421875,-1970.8759765625], KorokType.LiftRock);
		this.addKorok("T09", [-4123.61474609375,303.5287780761719,-1935.3367919921875], KorokType.OfferPepper);
		this.addKorok("T10", [-3780.53857421875,368.60992431640625,-1865.6239013671875], KorokType.OfferApple);
		this.addKorok("T11", [-3271.390625,244.43162536621094,-1868.2578125], KorokType.LiftRockTree, "Big tree");
		this.addKorok("T12", [-4225.7138671875,216.79598999023438,-1747.384765625], KorokType.LiftRockLeaves);
		this.addKorok("T13", [-4034.9833984375,273.2281799316406,-1748.4022216796875], KorokType.RockCircle);
		this.addKorok("T14", [-3627.3837890625,453.5585021972656,-1804.8251953125], KorokType.Balloon);
		this.addKorok("T15", [-3562.246337890625,289.5035095214844,-1761.345703125], KorokType.LiftRock);
		this.addKorok("T16", [-4065.46728515625,316.053466796875,-1678.327880859375], KorokType.FlowerChase);
		this.addKorok("T17", [-3696.666259765625,211.1060333251953,-1684.1099853515625], KorokType.Race, "Ordinal Low");
		this.addKorok("T18", [-2910.180419921875,382.2978515625,-1639.0374755859375], KorokType.Confetti, "Top of tree");
		this.addKorok("T19", [-3151.57470703125,185.5,-1563.2843017578125], KorokType.LilyPads, "No Drown");
		this.addKorok("T20", [-3444.365478515625,231.21157836914062,-1328.68994140625], KorokType.BlockPuzzle);
		this.addKorok("T21", [-3295.153564453125,250.0965118408203,-1362.92919921875], KorokType.LiftRockRubble);
		this.addKorok("T22", [-3125.193603515625,263.0080261230469,-1366.50634765625], KorokType.LiftRockRubble);
		this.addKorok("T23", [-4011.170654296875,205.67715454101562,-1167.085693359375], KorokType.RockCircle);
		this.addKorok("T24", [-3714.73779296875,302.7228698730469,-1040.96533203125], KorokType.LiftRock, "Behind malice");
		this.addKorok("T25", [-3078.343994140625,207.99400329589844,-1120.356201171875], KorokType.LiftRock, "On ledge");
		this.addKorok("T26", [-3971.632568359375,213.63412475585938,-920.5166015625], KorokType.TreeStump);
		this.addKorok("T27", [-4058.830322265625,208.5265655517578,-773.8511962890625], KorokType.OfferApple);
		this.addKorok("T28", [-3841.71337890625,218.4154052734375,-803.984619140625], KorokType.BoulderGolf, "Run after bomb");
		this.addKorok("T29", [-3803.93505859375,251.28421020507812,-772.46337890625], KorokType.LiftRock);
		this.addKorok("T30", [-3661.364501953125,257.37335205078125,-828.8035888671875], KorokType.Race, "SQ High", [
			[-3692.07, -792.07]
		]);
		this.addKorok("T31", [-3431.201904296875,278.01031494140625,-707.8410034179688], KorokType.OfferApple);
		this.addKorok("T32", [-3966.3115234375,293.9241027832031,-624.5618286132812], KorokType.LiftRock, "On pillar");
		this.addKorok("T33", [-3441.072509765625,357.3612365722656,-664.8755493164062], KorokType.Balloon, "Use bomb");
		this.addKorok("T34", [-3212.858642578125,235.0042266845703,-574.0104370117188], KorokType.Race, ".dir(W)", [
			[-3019.800573381027,-587]
		]);
		this.addKorok("T35", [-3524.551025390625,373.78106689453125,-449.694091796875], KorokType.LilyPads, "No Drown");
		this.addKorok("T36", [-4039.640869140625,239.30084228515625,-350.23876953125], KorokType.FlowerCount);
		this.addKorok("T37", [-3675.03564453125,390.4903564453125,-393.322265625], KorokType.Race, "SQ DEFUSE", [
			[-3647.1486788670913,-441]
		]);
		this.addKorok("W01", [-3847.195068359375,471.2814636230469,1467.0194091796875], KorokType.LiftRock);
		this.addKorok("W02", [-4001.077880859375,324.38525390625,1566.552490234375], KorokType.OfferBanana, "Pick up 4");
		this.addKorok("W03", [-4314.10595703125,219.01686096191406,1629.4090576171875], KorokType.OfferBanana, "No pick up, 1 left");
		this.addKorok("W04", [-4220.0205078125,257.5498352050781,1659.79736328125], KorokType.OfferBanana, "Pick up all");
		this.addKorok("W05", [-4266.5732421875,226.0547332763672,1691.5357666015625], KorokType.OfferBanana, "Pick up 1");
		this.addKorok("W06", [-4353.3876953125,242.21307373046875,1838.52587890625], KorokType.FlowerChase);
		this.addKorok("W07", [-2066.6513671875,228.32525634765625,1850.09716796875], KorokType.BlockPuzzle);
		this.addKorok("W08", [-2417.310546875,191.19989013671875,1923.7249755859375], KorokType.Confetti, "In crack");
		this.addKorok("W09", [-4685.2138671875,171.4608917236328,1970.388427734375], KorokType.Confetti, "Highest fin on skeleton");
		this.addKorok("W10", [-2550.17919921875,190.00433349609375,2038.1015625], KorokType.Balloon, "Bomb crack");
		this.addKorok("W11", [-2167.784423828125,336.4487609863281,2082.04248046875], KorokType.LiftRockTree);
		this.addKorok("W12", [-2264.51171875,356.98907470703125,2163.3798828125], KorokType.AcornHanging, "Bomb midair");
		this.addKorok("W13", [-4710.4853515625,209.7189178466797,2171.835205078125], KorokType.Confetti, "Highest fin on skeleton");
		this.addKorok("W14", [-2018.63232421875,188.73995971679688,2186.64306640625], KorokType.LiftRock, "End of bridge");
		this.addKorok("W15", [-2815.310546875,160.7108154296875,2247.91259765625], KorokType.LiftRock, "On pillar");
		this.addKorok("W16", [-2259.54150390625,357.45538330078125,2224.755859375], KorokType.BoulderGolf, "2 MS Hits");
		this.addKorok("W17", [-3353.039794921875,156.91778564453125,2276.30810546875], KorokType.BlockPuzzle);
		this.addKorok("W18", [-4607.90625,161.6078643798828,2338.8447265625], KorokType.Confetti, "Top of skeleton (pinwheel)");
		this.addKorok("W19", [-2853.362548828125,210.4986114501953,2320.153076171875], KorokType.LiftRock);
		this.addKorok("W20", [-1658.5899658203125,159.1199951171875,2306.77001953125], KorokType.Confetti, "In tree");
		this.addKorok("W21", [-1665.89892578125,143.884033203125,2338.162841796875], KorokType.BlockPuzzle);
		this.addKorok("W22", [-1399.4241943359375,220.2027130126953,2378.205322265625], KorokType.Balloon);
		this.addKorok("W23", [-2066.654052734375,288.819580078125,2397.044677734375], KorokType.Race, "", [
			[-2103.93, 304.02, 2297.19]
		]);
		this.addKorok("W24", [-2059.884521484375,306.7729187011719,2420.09912109375], KorokType.LiftRock, "On platform");
		this.addKorok("W25", [-4876.90771484375,153.29457092285156,2469.673583984375], KorokType.MatchCactus);
		this.addKorok("W26", [-1809.821044921875,162.5113525390625,2459.625], KorokType.BlockPuzzle);
		this.addKorok("W27", [-1615.96435546875,193.37147521972656,2447.328857421875], KorokType.Balloon, "2 Bomb Arrows (No BT)");
		this.addKorok("W28", [-4373.89794921875,165.13348388671875,2587.056640625], KorokType.Race, "On some pillars");
		this.addKorok("W29", [-3751.843505859375,157.35833740234375,2531.623779296875], KorokType.Race, "SQ DEFUSE", [
			[-3757.10, 2445.96]
		]);
		this.addKorok("W30", [-2594.754638671875,284.72015380859375,2539.869384765625], KorokType.BlockPuzzle);
		this.addKorok("W31", [-2358.780029296875,476.12371826171875,2554.533447265625], KorokType.LiftRock);
		this.addKorok("W32", [-2305.081787109375,486.2545166015625,2561.3642578125], KorokType.BlockPuzzle);
		this.addKorok("W33", [-2207.69189453125,432.16876220703125,2550.62109375], KorokType.Balloon, "Under bridge");
		this.addKorok("W34", [-1935.3447265625,452.79669189453125,2673.501708984375], KorokType.RockCircle);
		this.addKorok("W35", [-2628.114501953125,168.49464416503906,2751.20556640625], KorokType.Balloon, "Between arms. Shoot midair");
		this.addKorok("W36", [-4224.869140625,154.65057373046875,2738.07373046875], KorokType.MatchCactus);
		this.addKorok("W37", [-3107.27783203125,135.38699340820312,2881.241455078125], KorokType.FlowerChase, "On skeleton");
		this.addKorok("W38", [-2298.699951171875,352.56158447265625,2850.02001953125], KorokType.LiftRock, "On pillar");
		this.addKorok("W39", [-2019.6982421875,375.79608154296875,2884.23095703125], KorokType.BlockPuzzle);
		this.addKorok("W40", [-2685.724609375,206.05584716796875,2929.656494140625], KorokType.LiftRock, "Top of statue");
		this.addKorok("W41", [-1465.9058837890625,418.6670227050781,2952.556396484375], KorokType.LiftRock, "On overpass");
		this.addKorok("W42", [-3886.1416015625,229.43511962890625,2965.8203125], KorokType.Confetti);
		this.addKorok("W43", [-3435.38916015625,145.89991760253906,2980.16064453125], KorokType.FlowerChase);
		this.addKorok("W44", [-2918.65478515625,141.70884704589844,3061.014404296875], KorokType.BlockPuzzle);
		this.addKorok("W45", [-1599.4971923828125,307.148681640625,3099.939208984375], KorokType.RockCircle);
		this.addKorok("W46", [-1538.7425537109375,278.4040832519531,3070.0830078125], KorokType.LiftRockRubble, "Corner");
		this.addKorok("W47", [-4195.7490234375,165.6116180419922,3091.5537109375], KorokType.FlowerChase, "Right side of skeleton");
		this.addKorok("W48", [-2172.5087890625,185.72760009765625,3200.395751953125], KorokType.BlockPuzzle);
		this.addKorok("W49", [-1926.302734375,264.6315002441406,3241.9990234375], KorokType.BlockPuzzle);
		this.addKorok("W50", [-1922.2257080078125,332.9751281738281,3279.693359375], KorokType.LiftRock, "Top of big pillar");
		this.addKorok("W51", [-4862.19580078125,129.3501739501953,3260.96533203125], KorokType.MatchCactus);
		this.addKorok("W52", [-2636.19677734375,101.8104019165039,3302.57421875], KorokType.BlockPuzzle, "Inside skull");
		this.addKorok("W53", [-1379.1700439453125,592.9069213867188,3328.080078125], KorokType.LiftRock, "On pillar");
		this.addKorok("W54", [-1526.9757080078125,397.5132141113281,3405.892822265625], KorokType.LiftRock);
		this.addKorok("W55", [-4307.6123046875,132.1693572998047,3459.74462890625], KorokType.LiftRock, "On a rock");
		this.addKorok("W56", [-3799.648681640625,128.1500701904297,3428.88720703125], KorokType.LiftRock);
		this.addKorok("W57", [-3728.542236328125,166.4873504638672,3610.082763671875], KorokType.Balloon, "On tree in oasis");
		this.addKorok("W58", [-1996.600341796875,301.55316162109375,3619.667236328125], KorokType.Race, ".dir(S) Turn", [
			[-2018.5,3437.5960688548603]
		]);
		this.addKorok("W59", [-1611.5152587890625,411.2915344238281,3678.327392578125], KorokType.IceBlock, "3 Fire Arrows");
		this.addKorok("W60", [-1357.0343017578125,479.65753173828125,3671.9404296875], KorokType.IceBlock, "3 Fire Arrows");
		this.addKorok("W61", [-4347.89697265625,142.88563537597656,3713.184326171875], KorokType.MatchCactus);
		this.addKorok("W62", [-3031.62548828125,181.0055389404297,3754.590576171875], KorokType.RockCircle);
		this.addKorok("W63", [-2448.41162109375,134.73599243164062,3751.939697265625], KorokType.Race, "", [
			[-2591.20, 3543.36]
		]);
		this.addKorok("W64", [-1351.4581298828125,448.56793212890625,3770.79345703125], KorokType.RockCircle);
		this.addKorok("W65", [-4859.177734375,172.69601440429688,3832.94775390625], KorokType.Confetti, "Top of skeleton");
		this.addKorok("W66", [-4160.32666015625,133.13693237304688,3826.202392578125], KorokType.LiftRock);
		this.addKorok("W67", [-3286.43408203125,169.88096618652344,3787.150634765625], KorokType.MatchCactus);
		this.addKorok("W68", [-2547.4267578125,141.4355010986328,3951.93017578125], KorokType.LiftRock, "On pillar");
		this.addKorok("X01", [-308.7722473144531,132.6443634033203,-1166.0054931640625], KorokType.LiftRock, "On ledge");
		this.addKorok("X02", [-147.51226806640625,188.97129821777344,-1159.79443359375], KorokType.LilyPads, "No Drown");
		this.addKorok("X03", [-265.7392578125,250.3625946044922,-1138.7572021484375], KorokType.LiftRockRubble);
		this.addKorok("X04", [-378.6588134765625,163.60755920410156,-1112.09765625], KorokType.Balloon, "BA BT");
		this.addKorok("X05", [-250.14144897460938,432.88458251953125,-1061.67333984375], KorokType.Confetti, "Top of Castle");
		this.addKorok("X06", [-251.84375,517.1671752929688,-1061.7706298828125], KorokType.Balloon);
		this.addKorok("X07", [-383.2059326171875,347.4652404785156,-993.6246337890625], KorokType.Confetti, "Top of Zelda's Study");
		this.addKorok("X08", [-368.95452880859375,151.43075561523438,-993.4459228515625], KorokType.LiftRock, "Wooden Platform");
		this.addKorok("X09", [-335.40283203125,256.5638427734375,-1003.3189697265625], KorokType.LiftRock);
		this.addKorok("X10", [-254.0,364.01666259765625,-994.61376953125], KorokType.Race, "Glide", [
			[-254.77487446544274,-1044.25]
		]);
		this.addKorok("X11", [-100.920654296875,131.37802124023438,-979.7477416992188], KorokType.IceBlock);
		this.addKorok("X12", [-68.064697265625,261.281005859375,-979.623779296875], KorokType.LiftRock);
		this.addKorok("X13", [-436.57489013671875,117.51312255859375,-932.8250732421875], KorokType.OfferEgg);
		this.addKorok("X14", [-270.26129150390625,255.10687255859375,-879.1966552734375], KorokType.LiftRockRubble);
		this.addKorok("X15", [-168.36923217773438,216.01742553710938,-860.4058837890625], KorokType.AcornHanging, "Inside Room");
		this.addKorok("X16", [-162.05288696289062,310.1920166015625,-878.052978515625], KorokType.Confetti, "Top of Second Gatehouse");
		this.addKorok("X17", [-353.3800048828125,286.36749267578125,-829.608642578125], KorokType.Confetti, "Top of First Gatehouse");
		this.addKorok("X18", [-394.0272216796875,204.57997131347656,-785.4035034179688], KorokType.LiftRock, "On wall");
		this.addKorok("X19", [-324.3851013183594,185.6199188232422,-798.15869140625], KorokType.AcornHanging, "Inside 3AA Room");
		this.addKorok("X20", [-163.28408813476562,156.12698364257812,-784.677490234375], KorokType.LiftRockRubble);
		this.addKorok("X21", [-254.0015411376953,210.54885864257812,-739.5408935546875], KorokType.ShootEmblem);
		this.addKorok("X22", [-247.16346740722656,211.84344482421875,-739.613037109375], KorokType.Balloon, "Aim top wall in background");
		this.addKorok("X23", [-234.59304809570312,233.973388671875,-743.9327392578125], KorokType.Balloon);
		this.addKorok("X24", [-253.85301208496094,172.90855407714844,-632.2283325195312], KorokType.LiftRock, "On gate");
		this.addKorok("X25", [-230.68649291992188,148.0111541748047,-633.3798828125], KorokType.FlowerChase, "Across bridge", [
			[-257.55027693268767,-589.75],
			[-250.3031135689671,-584.75],
			[-246.55458079462915,-579],
			[-242.8060480202912,-586],
			[-236.80839558135085,-584.5],
			[-237.05829776630708,-590.5],
			[-236.55849339639462,-598.5],
			[-237.05829776630708,-611.75],
			[-232.80996062205668,-624.5]
		]);
		this.addKorok("Z01", [4707.05712890625,292.6219482421875,-1355.019775390625], KorokType.FlowerChase);
		this.addKorok("Z02", [1398.038330078125,125.98274230957031,-856.3475341796875], KorokType.Race, "Ordinal Low");
		this.addKorok("Z03", [1404.9525146484375,122.09262084960938,-832.9891357421875], KorokType.LightChase);
		this.addKorok("Z04", [3208.672607421875,570.483154296875,-1011.2259521484375], KorokType.LiftRock);
		this.addKorok("Z05", [3565.886474609375,530.6382446289062,-915.9223022460938], KorokType.LightChase);
		this.addKorok("Z06", [4702.88427734375,297.25079345703125,-1039.3314208984375], KorokType.LiftRock, "Wood Platform");
		this.addKorok("Z07", [4698.904296875,345.4613037109375,-1003.0245971679688], KorokType.LiftRock, "On pillar");
		this.addKorok("Z08", [3893.508056640625,549.9677734375,-704.2332763671875], KorokType.LiftRockRubble);
		this.addKorok("Z09", [4616.44140625,366.465576171875,-638.0287475585938], KorokType.LilyPads);
		this.addKorok("Z10", [4697.83984375,335.7004699707031,-547.030029296875], KorokType.LiftRockRubble);
		this.addKorok("Z11", [1104.0147705078125,210.75572204589844,-444.230712890625], KorokType.Balloon, "In tree");
		this.addKorok("Z12", [1632.92578125,119.0,-545.1971435546875], KorokType.LilyPads, "Drown");
		this.addKorok("Z13", [1832.721923828125,217.95472717285156,-535.6973876953125], KorokType.Race, "Ordinal Delay");
		this.addKorok("Z14", [2427.763916015625,301.4021301269531,-412.1216125488281], KorokType.Confetti, "Top of tree");
		this.addKorok("Z15", [2791.4638671875,451.4998474121094,-500.9319763183594], KorokType.BlockPuzzle);
		this.addKorok("Z16", [3323.916015625,301.629150390625,-519.5152587890625], KorokType.Confetti);
		this.addKorok("Z17", [3321.498046875,414.0921630859375,-514.253173828125], KorokType.Confetti, "Top of ZD");
		this.addKorok("Z18", [3520.640380859375,326.72760009765625,-383.5882568359375], KorokType.BlockPuzzle);
		this.addKorok("Z19", [4071.792724609375,483.7702331542969,-459.05377197265625], KorokType.BoulderGolf, "Magnesis");
		this.addKorok("Z20", [4136.6064453125,521.710693359375,-408.56671142578125], KorokType.FlowerChase);
		this.addKorok("Z21", [1088.531494140625,164.78854370117188,-215.89456176757812], KorokType.RockCircle, "Near water");
		this.addKorok("Z22", [2517.501220703125,182.5040283203125,-212.48138427734375], KorokType.LiftRock, "On hill");
		this.addKorok("Z23", [2746.14794921875,237.58753967285156,-176.40203857421875], KorokType.Well);
		this.addKorok("Z24", [3083.23876953125,363.92437744140625,-167.68960571289062], KorokType.FlowerChase, "Stay Grounded", [
			[2984.25,-177],
			[3014.75,-182.5],
			[3030.75,-170.25],
			[3047.75,-165.75],
			[3058.5,-158],
			[3069.5,-157.75],
			[3083.25,-159.75],
			[3090.25,-161.25],
			[3084.5,-166]
		]);
		this.addKorok("Z25", [3291.971923828125,295.3833923339844,-261.12060546875], KorokType.LiftRock, "On ledge");
		this.addKorok("Z26", [3527.287353515625,395.3050537109375,-276.76385498046875], KorokType.LiftRock, "Peak");
		this.addKorok("Z27", [4080.40625,421.47918701171875,-216.78250122070312], KorokType.BlockPuzzle);
		this.addKorok("Z28", [4232.73388671875,385.9993591308594,-212.3338623046875], KorokType.LiftRockRubble);
		this.addKorok("Z29", [1185.501953125,164.2552490234375,-67.41909790039062], KorokType.RockCircle);
		this.addKorok("Z30", [1387.27880859375,135.21963500976562,-112.92886352539062], KorokType.RockCircle);
		this.addKorok("Z31", [2665.53125,205.78012084960938,-1.298675537109375], KorokType.Basketball);
		this.addKorok("Z32", [3122.881103515625,185.60488891601562,-17.398681640625], KorokType.RockCircle, "Below bridge");
		this.addKorok("Z33", [3206.764404296875,312.25048828125,23.680877685546875], KorokType.LightChase);
		this.addKorok("Z34", [3303.744140625,393.3526611328125,22.583587646484375], KorokType.LiftRock, "Peak");
		this.addKorok("Z35", [4134.865234375,294.9371032714844,60.320831298828125], KorokType.LiftRockRubble);
		this.addKorok("Z36", [4294.8203125,171.3062286376953,78.50094604492188], KorokType.LiftRockRubble);
		this.addKorok("Z37", [883.0737915039062,133.6105194091797,274.79766845703125], KorokType.LiftRock, "middle of thorns");
		this.addKorok("Z38", [1434.73583984375,117.50345611572266,135.4036865234375], KorokType.Well);
		this.addKorok("Z39", [1593.18701171875,115.98478698730469,114.16122436523438], KorokType.LightChase);
		this.addKorok("Z40", [1736.362548828125,129.0440673828125,85.67816162109375], KorokType.AcornHanging, "From tree");
		this.addKorok("Z41", [2085.78759765625,129.7887725830078,181.66256713867188], KorokType.RockCircle);
		this.addKorok("Z42", [2769.947021484375,123.2162857055664,348.84613037109375], KorokType.Balloon, "Shoot from above");
		this.addKorok("Z43", [2927.665771484375,292.9400634765625,332.80035400390625], KorokType.BlockPuzzle);
		this.addKorok("Z44", [3140.85693359375,220.79481506347656,324.96734619140625], KorokType.LightChase);
		this.addKorok("Z45", [3854.316162109375,150.8157501220703,352.25689697265625], KorokType.LightChase);
		this.addKorok("Z46", [4144.4384765625,138.33706665039062,195.96945190429688], KorokType.BlockPuzzle);
		this.addKorok("Z47", [1116.1416015625,119.93097686767578,555.5753173828125], KorokType.LiftRockBoulder);
		this.addKorok("Z48", [1313.9736328125,115.90508270263672,503.06964111328125], KorokType.LightChase);
		this.addKorok("Z49", [1446.4981689453125,116.03910064697266,558.3604125976562], KorokType.MatchTree, "left tree");
		this.addKorok("Z50", [1685.6029052734375,129.8256072998047,661.124755859375], KorokType.LightChase);
		this.addKorok("Z51", [3271.144287109375,105.92276763916016,656.82080078125], KorokType.RockCircle);
		this.addKorok("Z52", [3431.14111328125,146.40928649902344,523.7473754882812], KorokType.LiftRockLeaves);
		this.addKorok("Z53", [3451.990234375,143.5695037841797,550.7929077148438], KorokType.FlowerChase, "In cave");
		this.addKorok("Z54", [3561.943359375,106.2442398071289,626.3196411132812], KorokType.LiftRockRubble);
		this.addKorok("Z55", [3721.2626953125,108.24295043945312,617.6266479492188], KorokType.LiftRock);
		this.addKorok("Z56", [4199.4560546875,107.14155578613281,463.67498779296875], KorokType.Basketball, "On stone");
		this.addKorok("Z57", [4264.458984375,126.76092529296875,628.2207641601562], KorokType.LiftRockSlab);
		this.addKorok("Z58", [4452.65087890625,164.2637939453125,483.97357177734375], KorokType.Balloon, "In cave");
		this.addKorok("Z59", [4572.53564453125,134.99270629882812,647.8931884765625], KorokType.FlowerChase, "Start in forest");
		this.addKorok("Z60", [1595.75537109375,117.39181518554688,807.6757202148438], KorokType.OfferApple, "In cave");
		this.addKorok("Z61", [4499.12158203125,123.24421691894531,1015.0103759765625], KorokType.FlowerChase);
		this.addKorok("Z62", [4533.4384765625,111.22705078125,1022.9850463867188], KorokType.RockCircle, "During flower chase");
        
	}

	public recognizes(name: string): boolean {
		return name.startsWith("_Korok::") && name.substring(8) in this.map;
	}
	public compile(typedString: TypedString): RouteAssembly | undefined {
		const content = typedString.toString();
		if (!content.startsWith("_Korok::")){
			return undefined;
		}
		const id = content.substring(8);
		if(!(id in this.map)){
			return undefined;
		}
		return this.map[id]();
	}

	private addKorok(id: string,  coord: [number, number, number], type: KorokType, comment?: string, movement?: number[][]): void{
		this.map[id] = () => ({
			text: new TypedStringSingle({
				content: id+" "+type,
				type: StringType.Npc
			}),
			comment: StringParser.parseStringBlockSimple(comment || ""),
			icon: mapKorokToImage(type),
			splitType: SplitType.Korok,
			movements: (movement ?[...movement, [coord[0], coord[2]]]: [[coord[0], coord[2]]]).map(([x, z])=>({
				to: {x, z},
				isAway: false,
				isWarp: false,
			})),
			timeOverride: mapKorokToEstimate(type),

		});
        
	}

}

const mapKorokToImage = (korok: KorokType):string =>{
	switch(korok){
		case KorokType.Acorn: return "korok-acorn";
		case KorokType.AcornFlying: return "korok-acorn-flying";
		case KorokType.AcornLog: return "korok-acorn";
		case KorokType.AcornTree: return "korok-acorn";
		case KorokType.AcornHanging: return "korok-acorn";
		case KorokType.Balloon: return "korok-balloon";
		case KorokType.Basketball: return "korok-basketball";
		case KorokType.Beard: return "korok";
		case KorokType.BlockPuzzle: return "korok-magnesis";
		case KorokType.BoulderCircle: return "korok-rock-circle";
		case KorokType.BoulderGolf: return "korok-golf-boulder";
		case KorokType.Confetti: return "korok-confetti";
		case KorokType.FlowerChase: return "korok-flower";
		case KorokType.FlowerCount: return "korok-flower";
		case KorokType.IceBlock: return "korok-ice";
		case KorokType.JumpFence: return "korok";
		case KorokType.LiftRock: return "korok-rock";
		case KorokType.LiftRockDoor: return "korok-magnesis";
		case KorokType.LiftRockTree: return "korok-rock-tree";
		case KorokType.LiftRockRubble: return "korok-rock-under";
		case KorokType.LiftRockBoulder: return "korok-rock-under";
		case KorokType.LiftRockLeaves: return "korok-rock-under";
		case KorokType.LiftRockSlab: return "korok-rock-under";
		case KorokType.LightChase: return "korok-light-chase";
		case KorokType.LilyPads: return "korok-lily";
		case KorokType.LuminousStone: return "korok";
		case KorokType.MatchTree: return "korok-matching";
		case KorokType.MatchCactus: return "korok-matching";
		case KorokType.MetalBoxCircle: return "korok-magnesis";
		case KorokType.OfferApple: return "korok-offer-apple";
		case KorokType.OfferBanana: return "korok-offer-banana";
		case KorokType.OfferDurian: return "korok-offer-durian";
		case KorokType.OfferEgg: return "korok-offer-egg";
		case KorokType.OfferPalmFruit: return "korok-offer-durian";
		case KorokType.OfferPepper: return "korok-offer-apple";
		case KorokType.OfferShield: return "korok-offer-apple";
		case KorokType.Race: return "korok-race";
		case KorokType.RockCircle: return "korok-rock-circle";
		case KorokType.ShootEmblem: return "korok-shoot";
		case KorokType.SnowballGolf: return "korok-golf-snowball";
		case KorokType.Torch: return "korok";
		case KorokType.TreeBranch: return "korok";
		case KorokType.TreeStump: return "korok-magnesis";
		case KorokType.Well: return "korok-magnesis";
		case KorokType.Other: return "korok";
		default: return "korok";
	}
};

const mapKorokToEstimate = (korok: KorokType):number =>{
	switch(korok){
		case KorokType.Acorn: return 5;
		case KorokType.AcornFlying: return 5;
		case KorokType.AcornLog: return 5;
		case KorokType.AcornTree: return 5;
		case KorokType.AcornHanging: return 5;
		case KorokType.Balloon: return 10;
		case KorokType.Basketball: return 8;
		case KorokType.Beard: return 2;
		case KorokType.BlockPuzzle: return 10;
		case KorokType.BoulderCircle: return 10;
		case KorokType.BoulderGolf: return 5;
		case KorokType.Confetti: return 5;
		case KorokType.FlowerChase: return 12;
		case KorokType.FlowerCount: return 10;
		case KorokType.IceBlock: return 10;
		case KorokType.JumpFence: return 15;
		case KorokType.LiftRock: return 2;
		case KorokType.LiftRockDoor: return 3;
		case KorokType.LiftRockTree: return 5;
		case KorokType.LiftRockRubble: return 3;
		case KorokType.LiftRockBoulder: return 3;
		case KorokType.LiftRockLeaves: return 3;
		case KorokType.LiftRockSlab: return 4;
		case KorokType.LightChase: return 5;
		case KorokType.LilyPads: return 5;
		case KorokType.LuminousStone: return 5;
		case KorokType.MatchTree: return 5;
		case KorokType.MatchCactus: return 5;
		case KorokType.MetalBoxCircle: return 10;
		case KorokType.OfferApple: return 3;
		case KorokType.OfferBanana: return 3;
		case KorokType.OfferDurian: return 3;
		case KorokType.OfferEgg: return 3;
		case KorokType.OfferPalmFruit: return 3;
		case KorokType.OfferPepper: return 3;
		case KorokType.OfferShield: return 3;
		case KorokType.Race: return 15;
		case KorokType.RockCircle: return 10;
		case KorokType.ShootEmblem: return 5;
		case KorokType.SnowballGolf: return 10;
		case KorokType.Torch: return 5;
		case KorokType.TreeBranch: return 1;
		case KorokType.TreeStump: return 8;
		case KorokType.Well: return 8;
		case KorokType.Other: return 5;
		default: return 5;
	}
};

export default new KorokModule();
